//Constants to api paths and pool list here
const GitUser = "ghost-coin";
const GitRepo = "ghost-coldstaking-pools";
const POOL_API_JSONPATH = "api/json/";
const POOL_API_CONFIGPATH = "api/config/";
const POOL_JSON_URL = `https://raw.githubusercontent.com/${GitUser}/${GitRepo}/master/list.json`;

//Simple funcs to get specific pool api paths
function getAPIJsonURL(poolurl) {
  return `${poolurl}${POOL_API_JSONPATH}`;
}
function getAPIConfigURL(poolurl) {
  return `${poolurl}${POOL_API_CONFIGPATH}`;
}

module.exports = {
  POOL_JSON_URL,
  POOL_API_CONFIGPATH,
  POOL_API_JSONPATH,
  getAPIJsonURL,
  getAPIConfigURL,
};
