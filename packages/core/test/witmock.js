const { assert } = require("chai")

// Contracts
const WitmonMock = artifacts.require("WitmonMock")

contract("WitmonMock", accounts => {
  describe("mintCreature(): ", () => {
    let witmock
    before(async () => {
      witmock = await WitmonMock.deployed()
    })

    it("should mint a new creature", async () => {
      const lol = await witmock.mintCreature(
        "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71", // address _eggOwner,
        0, // uint256 _eggIndex,
        0, // uint256 _eggColorIndex,
        0, // uint256 _eggScore,
        1, // uint256 _eggRanking,
        2, // uint256 _totalEggs
        // eslint-disable-next-line max-len
        "0xc9872184df85bb8d4d1abeb009b6b8967029c4edc0ef75f7d74b1db4d921de6b5faa476f905dc50826010a71614a426a84368fcdc32e570e6fc25e7e73164b471b"
      )
      // assert.equal(hash, test.hash)
      assert.equal(lol.logs[0].event, "NewCreature")
    })
  })
})
