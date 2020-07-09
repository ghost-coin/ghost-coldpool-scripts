function checkSpecsMatch(poolconfigdata, elementJSONData) {
  console.log(`Checking if info matches for ${elementJSONData.website}`);
  var infoMatches =
    checkPoolFeeMatch(
      poolconfigdata.parameters[0].poolfeepercent,
      elementJSONData.fee
    ) &&
    checkPubkeyMatch(poolconfigdata.pooladdress, elementJSONData.public_key) &&
    checkStakeBonusMatch(
      poolconfigdata.parameters[0].stakebonuspercent,
      elementJSONData.stakebonus
    );
  console.log(infoMatches);
}
function checkPoolFeeMatch(exfee, realfee) {
  return CheckMatchUtil(exfee, realfee, "Fee");
}
function checkPubkeyMatch(expubkey, realpubkey) {
  return CheckMatchUtil(expubkey, realpubkey, "Pubkey");
}
function checkStakeBonusMatch(exstakebonus, realbonus) {
  return CheckMatchUtil(exstakebonus, realbonus, "Stakebonus");
}

function CheckMatchUtil(exval, realval, DescCheck) {
  if (exval == realval) {
    console.log(`${DescCheck} ✅`);
    return true;
  }
  console.log(`${DescCheck} ❌`);
  return false;
}

module.exports = {
  checkSpecsMatch,
  checkPoolFeeMatch,
  checkPubkeyMatch,
  checkStakeBonusMatch,
};
