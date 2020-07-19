const axios = require('axios')
const checkData = true
const Showstats = false
const CheckHelper = require('./helpers/checkmatch')
const Formatter = require('./helpers/formatter')

const Constants = require('./helpers/constants')
var colors = require('colors')
var totalDelegated = 0
var totalBlocks = 0
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

async function getPoolStats () {
  try {
    // Get list.json
    const response = await axios.get(Constants.POOL_JSON_URL)
    await getJSONStats(response.data)
  } catch (error) {
    console.error(error)
  }
}

async function getJSONStats (data) {
  // To track number of runs the forEach does
  var index = 0
  data.forEach(async (element) => {
    try {
      const resPoolJSON = await axios.get(
        Constants.getAPIJsonURL(element.website)
      )
      ++index
      if (Showstats) processPoolData(index, element, resPoolJSON, data)
      if (checkData) {
        const resPoolConfig = await axios.get(
          Constants.getAPIConfigURL(element.website)
        )
        if (!CheckHelper.checkSpecsMatch(resPoolConfig.data, element)) {
          console.error(`${element.website} has mismatching info`.red)
        }
      }
    } catch (errorres) {
      console.error(errorres)
    }
  })
}

function processPoolData (index, element, resPoolJSON, arr) {
  const delegatedamt = resPoolJSON.data.watchonlytotalbalance
  const coldstakedblocks = resPoolJSON.data.blocksfound
  console.log(
    `${colors.blue(element.website).underline} has ${colors.brightBlue(
      Formatter.formatAmtWithTicker(delegatedamt)
    )} ${colors.brightBlue('Delegated')}`
  )
  totalDelegated += delegatedamt
  totalBlocks += coldstakedblocks
  // Log total stats if we are at the last pool
  if (index === arr.length) {
    logTotal()
  }
}

function logTotal () {
  console.log(`Total Blocks Cold-Staked : ${totalBlocks}`.brightBlue)
  console.log(
    `Total Delegated : ${Formatter.formatAmtWithTicker(totalDelegated)}`.green
  )
}

getPoolStats()
