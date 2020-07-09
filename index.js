const axios = require("axios");
const checkData = true;
const Showstats = false;
const CheckHelper = require("./helpers/checkmatch");
const Constants = require("./constants");

var totalDelegated = 0,
  totalBlocks = 0;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function getPoolStats() {
  try {
    //Get list.json
    const response = await axios.get(Constants.POOL_JSON_URL);
    await getJSONStats(response.data);
  } catch (error) {
    console.error(error);
  }
}

async function getJSONStats(data) {
  index = 0;
  data.forEach(async (element) => {
    try {
      const resPoolJSON = await axios.get(
        element.website + Constants.POOL_API_JSONPATH
      );
      ++index;
      if (Showstats) processPoolData(index, element, resPoolJSON, data);
      if (checkData) {
        const resPoolConfig = await axios.get(
          element.website + Constants.POOL_API_CONFIGPATH
        );
        CheckHelper.checkSpecsMatch(resPoolConfig.data, element);
      }
    } catch (errorres) {
      console.error(errorres);
    }
  });
}

function processPoolData(index, element, resPoolJSON, arr) {
  console.log(
    `${element.website} has ${resPoolJSON.data.watchonlytotalbalance.toFixed(
      2
    )} GHOST Delegated`
  );
  totalDelegated += resPoolJSON.data.watchonlytotalbalance;
  totalBlocks += resPoolJSON.data.blocksfound;
  logTotal(index, arr);
}

function logTotal(index, arr) {
  //Check if we are at the last pool index
  if (index === arr.length) {
    console.log(`Total Blocks coldstaked : ${totalBlocks}`);
    console.log(`Total Coins Delegated : ${totalDelegated}`);
  }
}

getPoolStats();
