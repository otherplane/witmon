const WitmonMock = artifacts.require("WitmonMock")

module.exports = async function (deployer, network) {

  await deployer.deploy(
    WitmonMock,
    "0x12890D2cce102216644c59daE5baed380d84830c" // signator
  )
};
