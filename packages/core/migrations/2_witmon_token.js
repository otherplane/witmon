const fs = require("fs")
const witmonAddresses = require("./witmon.addresses.json")
const witnetAddresses = require("witnet-solidity-bridge/migrations/witnet.addresses")
const WitmonERC721 = artifacts.require("WitmonERC721");
const WitmonLiscon21 = artifacts.require("WitmonLiscon21");
const WitnetRequestBoard = artifacts.require("WitnetRequestBoard")
module.exports = async function (deployer, network, accounts) {  
  network = network.split("-")[0]
  if (network !== "test") {
    if (!witmonAddresses[network]) {
      witmonAddresses[network] = {}
    }
    if (!witmonAddresses[network].WitmonERC721) {
      witmonAddresses[network].WitmonERC721 = ""
    }
    WitnetRequestBoard.address = witnetAddresses.default[network].WitnetRequestBoard
  } else {
    const WitnetRequestBoardMock = artifacts.require("WitnetRequestBoardMock")
    if (!WitnetRequestBoardMock.isDeployed()) {
      await deployer.deploy(WitnetRequestBoardMock)
    }
    WitnetRequestBoard.address = WitnetRequestBoardMock.address; 
  }
  if (network === "test" || witmonAddresses[network].WitmonERC721 === "") {
    await deployer.deploy(
      WitmonERC721,
      WitnetRequestBoard.address,
      "Witty Creatures 2.0",            // name
      "WITMON",                         // symbol
      accounts[0],                      // signator
      WitmonLiscon21.address,           // decorator    
      [60, 30, 10],                     // percentile marks
      80640,                            // expirationDays (~ 14 days)
      525                               // totalEggs
    )
    if (network !== "test") {
      witmonAddresses[network].WitmonERC721 = WitmonERC721.address
      fs.writeFileSync("./migrations/witmon.addresses.json", JSON.stringify(witmonAddresses, null, 4), { flag: 'w+' })
    }
  } else {
    WitmonERC721.address = witmonAddresses[network].WitmonERC721
    console.info("   > Skipped: presumably deployed at", WitmonERC721.address)
  }  
};
