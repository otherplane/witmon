const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WitmonERC721 = artifacts.require("WitmonERC721")
const WitmonLiscon21 = artifacts.require("WitmonLiscon21")
const WitnetRequestBoardMock = artifacts.require("WitnetRequestBoardMock")

contract("WitmonERC721", accounts => {
    let witmon;
    let owner = accounts[0]
    let stranger = accounts[1]
    let signator = accounts[2]
    let eggOwner = accounts[3]
    before(async () => {
        witmon = await WitmonERC721.new(      
            WitnetRequestBoardMock.address,
            WitmonLiscon21.address, // decorator
            "Witty Creatures 2.0",  // name
            "WITMON",               // symbol
            signator,               // signator
            [10, 30, 60],           // percentile marks
            80640                   // expirationDays (~ 14 days)
        )
    })
    describe("State-machine happy path", async () => {
        describe("In status: 'Batching'", async () => {
            beforeEach(async () => {
                let status = await witmon.getStatus.call()
                assert.equal(status.toString(), "0")
            })
            describe("IWitmonSurrogates", async() => {
                describe("mintCreature(..)", async () => {
                    it("creatures cannot be minted", async () => {
                        await truffleAssert.reverts(
                            witmon.mintCreature(
                                eggOwner,
                                0,
                                0,
                                0,
                                0,
                                512,
                                "0x0"
                            ),
                            "not in Hatching"
                        )
                    })
                })
            })
            describe("IWitmonView", async () => {
                describe("getCreatureStatus(0)", async () => {
                    it("creature 0 is in 'Incubating' status", async() => {
                        let cStatus = await witmon.getCreatureStatus.call(0)
                        assert.equal(cStatus.toString(), "1")
                    })
                })
            })
            describe("IWitmonAdmin", async() => {
                describe("setDecorator(..)", async () => {
                    it("signator cannot change decorator", async () => {
                        // TODO
                    })
                    it("stranger cannot change decorator", async() => {
                        // TODO
                    })
                })
                describe("setParameters(..)", async () => {
                    it("owner can change valid parameters", async () => {
                        await witmon.setParameters(
                            signator,
                            [10, 30, 60],
                            80640,
                            { from: owner }
                        )
                        console.log(await witmon.getParameters.call())
                    })
                    it("stranger cannot change parameters", async() => {
                        await truffleAssert.reverts(
                            witmon.setParameters(
                                stranger,
                                [10, 30, 60],
                                80640,
                                { from: stranger }
                            ),
                            "Ownable"
                        )
                    })
                    it("signator cannot change parameters", async() => {
                        await truffleAssert.reverts(
                            witmon.setParameters(
                                stranger,
                                [10, 30, 60],
                                80640,
                                { from: signator }
                            )
                        )
                    })
                    it("signator cannot be set to zero", async () => {
                        await truffleAssert.reverts(
                            witmon.setParameters(
                                "0x0000000000000000000000000000000000000000",
                                [10, 30, 60],
                                80640,
                                { from: owner }
                            )
                        )
                    })
                    // it("decorator cannot be set to zero", async () => {
                    //     await truffleAssert.reverts(
                    //         witmon.setParameters(
                    //             signator,
                    //             "0x0000000000000000000000000000000000000000",
                    //             [10, 30, 60],
                    //             80640,
                    //             { from: owner }
                    //         )
                    //     )
                    // })
                    it("fails if bad number of percentiles is passed", async () => {
                        await truffleAssert.reverts(
                            witmon.setParameters(
                                signator,
                                [10, 30],
                                80640,
                                { from: owner }
                            )
                        )
                    })
                    it("fails if percentiles don't sum up 100", async () => {
                        await truffleAssert.reverts(
                            witmon.setParameters(
                                signator,
                                [10, 30, 55],
                                80640,
                                { from: owner }
                            )
                        )
                    })
                })
                describe("startHatching()", async () => {
                    it("hatching cannot start", async () => {
                        await truffleAssert.reverts(
                            witmon.startHatching({ from: owner }),
                            "not in Randomizing"
                        )
                    })
                })
                describe("stopBatching()", async () => {
                    it("signator cannot stop batching", async () => {
                        await truffleAssert.reverts(
                            witmon.stopBatching({
                                from: signator,
                                value: 10 ** 10 // 10 gwei
                            }),
                            "Ownable"
                        )
                    })
                    it("stranger cannot stop batching", async () => {
                        await truffleAssert.reverts(
                            witmon.stopBatching({
                                from: stranger,
                                value: 10 ** 10 // 10 gwei
                            }),
                            "Ownable"
                        )
                    })
                    it("owner can stop batching", async() => {
                        await witmon.stopBatching({ 
                            from: owner,
                            value: 10 ** 10 // 10 gwei
                        })
                    })
                })
            })
        })
    })
})