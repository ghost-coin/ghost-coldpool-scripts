function checkSpecsMatch (poolconfigdata, elementJSONData) {
  console.log(`Checking if info matches for ${elementJSONData.website}`)
  var infoMatches =
    checkPoolFeeMatch(elementJSONData.fee,
      poolconfigdata.parameters[0].poolfeepercent
    ) &&
    checkPubkeyMatch(elementJSONData.public_key,poolconfigdata.pooladdress) &&
    checkStakeBonusMatch(elementJSONData.stakebonus,
      poolconfigdata.parameters[0].stakebonuspercent
    )
  return infoMatches
}

function checkPoolFeeMatch (exfee, realfee) {
  return CheckMatchUtil(exfee, realfee.toString(), 'Fee')
}
function checkPubkeyMatch (expubkey, realpubkey) {
  return CheckMatchUtil(expubkey, realpubkey, 'Pubkey')
}
function checkStakeBonusMatch (exstakebonus, realbonus) {
  return CheckMatchUtil(exstakebonus, realbonus.toString(), 'Stakebonus')
}

function CheckMatchUtil (exval, realval, DescCheck) {
  if (exval === realval) {
    console.log(`${DescCheck}`.green)
    return true
  }
  console.log(`${DescCheck} ${exval} != ${realval}`.red)
  return false
}

module.exports = {
  checkSpecsMatch,
  checkPoolFeeMatch,
  checkPubkeyMatch,
  checkStakeBonusMatch
}
