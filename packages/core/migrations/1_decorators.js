const fs = require("fs")
const witmonAddresses = require("./witmon.addresses.json")
const WitmonLiscon21 = artifacts.require("WitmonLiscon21");
module.exports = async function (deployer, network) {
  if (!witmonAddresses[network]) {
    witmonAddresses[network] = {}
  }
  if (!witmonAddresses[network].WitmonLiscon21) {
    witmonAddresses[network].WitmonLiscon21 = ""
  }
  if (witmonAddresses[network].WitmonLiscon21 === "") {
    await deployer.deploy(WitmonLiscon21, "https://witmon.com/creatures/")
    witmonAddresses[network].WitmonLiscon21 = WitmonLiscon21.address
    fs.writeFileSync("./migrations/witmon.addresses.json", JSON.stringify(witmonAddresses, null, 4), { flag: 'w+' })
  } else {
    WitmonLiscon21.address = witmonAddresses[network].WitmonLiscon21
    console.info("   > Skipped: presumably deployed at", WitmonLiscon21.address)
  }
};
