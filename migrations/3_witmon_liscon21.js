const WitmonLiscon21 = artifacts.require("WitmonLiscon21");
const WitmonERC721 = artifacts.require("WitmonERC721");

module.exports = async function (deployer, network) {
  await deployer.deploy(WitmonLiscon21)
  const token = await WitmonERC721.deployed()
  await token.newBatch(
    "Witmon.LisCon2021",
    "https://witmon.com/creatures/",
    WitmonLisco21.address,
    80640 // hatchingExpirationBlocks ~ 14 days
  )
};
