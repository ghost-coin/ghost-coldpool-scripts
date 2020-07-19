const Insight = require('insight-explorer').Insight
const genesisAddrs = [
  'GZaPN2m7hRUDumJ7qZd65u3tT362khT3LF',
  'GQtToV2LnHGhHy4LRVapLDMaukdDgzZZZV',
  'Ga7ECMeX8QUJTTvf9VUnYgTQUFxPChDqqU',
  'GgEsaUiyMA8j67pw9SkRiWn3sNcXdFiKb6',
  'GWGAyWQ3zKBUdUq5zFhe96zhzqR7TeryjM',
  'Gc4TsqMNxNy5N2AewSbmX5Uf2gpccx9gve',
  'GdycWJ7SwaptNxr4naQ3ybQu7fA1pZxPSN',
  'GYGPHkiAPvU7nN8tCWDsrJBrvyXVWq5cJ3',
  'GWj4kyJqTQGAhCFHDUer7CoXCu6AvGcoaU',
  'GgV5htjf6WdNfYywRvYGcTTEv2e98RAc1y',
  'GVcCdZoEvr52S46ug5G5BvoHKXpt9ZKV79',
  'GYSBPbcb4n8ncSdGn9BSJt2rRWMjjJhbz9',
  'GS2gpPVRhNdXP4mMEopMmPy8Y2txfQTdDR',
  'GYpPFcM2XkPFd36SuhUgF5Tii9HKov5ZwL',
  'GQ9MoCWvDxEH1em3jdXEbjgag9kryk4FZ7',
  'GTN4cxVh4PryFGAnYJDhudrD1UamPofmGw',
  'GdUWT5jz8Jk61dP9fVUTWBsCPYNDNDq8WZ',
  'GJyEDvdYg4RntmA5zZsveiEadQn12KVjGH',
  'Gajqaa3ZU9VoWbtQtdA2qba7wYzYAKJ98m',
  'GcrkWTjM8nbseKCv7sBdeBhVwMx3PGgwSe'
]
const explorer = new Insight('http://ghostscan.io/ghost-insight-api')
const IncrementAmt = 50
const MaxLimitPerTxReq = 50
var options = { from: 0, to: IncrementAmt }
var stats = { totalstakeblocks: 0.0, totalstakerewards: 0.0, totaldevrewards: 0.0, devfeeblocks: 0 }
let txslength = options.from
const DebugMode = true
async function GetHistory () {
  if (DebugMode) {
    console.log('From ' + options.from)
    console.log('TO ' + options.to)
  }

  await explorer.getTransactionsForAddresses(genesisAddrs, options).then(function (txs) {
    txslength = txs.items.length
    let currDevfeeamount = 0
    // Bump options for next set
    if (txslength === MaxLimitPerTxReq) { IncrementOptions() }

    txs.items.forEach(tx => {
      if (tx.isCoinStake) {
        var stakeReward = Math.abs(tx.fees)
        if (stakeReward > 5 && stakeReward < 716) { console.error('Detected higher than normal reward ' + stakeReward + 'At txhash ' + tx.txid) }
        if (stakeReward < 716) {
          ++stats.totalstakeblocks
          stats.totalstakerewards += stakeReward
        } else {
          console.log('Detected possible devfee coinstake at ' + tx.txid)
          tx.vout.forEach(voutitem => {
            if (voutitem.value > 712 && voutitem.value < 716) {
              currDevfeeamount = parseFloat(voutitem.value)
              stats.totaldevrewards += currDevfeeamount
            }
          })
          stakeReward = stakeReward - currDevfeeamount

          if (DebugMode) {
            console.log('Stake reward ' + stakeReward)
            console.log('devreward ' + currDevfeeamount)
            console.log('totaldevreward ' + stats.totaldevrewards)
          }
          ++stats.devfeeblocks
          ++stats.totalstakeblocks
          stats.totalstakerewards += stakeReward
        }
        if (DebugMode) {
            console.log('Total stakeblocks ' + stats.totalstakeblocks)
            console.log('Total stakerewards ' + stats.totalstakerewards)
        }
      }
    })
  })
}

function IncrementOptions () {
  options.from += IncrementAmt
  options.to += IncrementAmt
}
const getStakeStats = async _ => {
  console.log('Start')
  for (var runs = 0; txslength === 0 || txslength === MaxLimitPerTxReq; runs++) {
    console.log('At run : ' + runs)
    await GetHistory()
  }
  console.log('Total coinstakes ' + stats.totalstakeblocks)
  console.log('Total devFee Blocks ' + stats.devfeeblocks)
  console.log('Total DevFund rewards ' + stats.totaldevrewards)
  console.log('Total Rewards ' + stats.totalstakerewards)
}
getStakeStats()
