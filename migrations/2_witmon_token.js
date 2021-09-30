const WitmonERC721 = artifacts.require("WitmonERC721");
const witnetAddresses = require("witnet-ethereum-bridge/migrations/witnet.addresses")

module.exports = function (deployer, network) {
  deployer.deploy(
    WitmonERC721,
    witnetAddresses.default[network].WitnetRequestBoard
  );
};
