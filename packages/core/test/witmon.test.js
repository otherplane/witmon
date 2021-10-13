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
    let eggOwner0 = "0x184cc5908e1a3d29b4d31df67d99622c4baa7b71"
    let eggOwner1 = accounts[2]
    let eggOwner2 = accounts[3]
    let eggSignator = "0x12890D2cce102216644c59daE5baed380d84830c"
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
                                eggOwner0,
                                0,
                                1,
                                800,
                                2,
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "not in Hatching"
                        )
                    })
                })
                describe("previewCreature(..)", async() => {
                    it("creature images cannot be previewed", async () => {
                        await truffleAssert.reverts(
                            witmon.previewCreatureImage(
                                eggOwner0,
                                0,
                                1,
                                800,
                                2,
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "not in Hatching"
                        )
                    })
                })
            })
            describe("IWitmonView", async () => {
                describe("getCreatureStatus(..)", async () => {
                    it("creature #0 is in 'Incubating' status", async() => {
                        let cStatus = await witmon.getCreatureStatus.call(0)
                        assert.equal(cStatus.toString(), "1")
                    })
                })
            })
            describe("IWitmonAdmin", async() => {
                describe("setDecorator(..)", async () => {
                    it("signator cannot change decorator", async () => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(stranger, { from: signator }),
                            "Ownable"
                        )
                    })
                    it("stranger cannot change decorator", async() => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(stranger, { from: stranger }),
                            "Ownable"
                        )
                    })
                    it("decorator cannot be set to zero", async () => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(
                                "0x0000000000000000000000000000000000000000",
                                { from: owner }
                            ),
                            "no decorator"
                        )
                    })
                    it("owner can change decorator", async() => {
                        await witmon.setDecorator(WitmonLiscon21.address, { from: owner })
                    })
                })
                describe("setParameters(..)", async () => {
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
                    it("owner can change valid parameters", async () => {
                        await witmon.setParameters(
                            eggSignator,
                            [10, 30, 60],
                            80640,
                            { from: owner }
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
                        // check status changed to 'Randomizing'
                        let status = await witmon.getStatus.call()
                        assert.equal(status.toString(), "1")
                    })
                })
            })
        })

        describe("In status: 'Randomizing'", async () => {
            beforeEach(async () => {
                let status = await witmon.getStatus.call()
                assert.equal(status.toString(), "1")
            })
            describe("IWitmonSurrogates", async() => {
                describe("mintCreature(..)", async () => {
                    it("creatures cannot be minted", async () => {
                        await truffleAssert.reverts(
                            witmon.mintCreature(
                                eggOwner0,
                                0,
                                1,
                                800,
                                2,
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "not in Hatching"
                        )
                    })
                })
                describe("previewCreature(..)", async() => {
                    it("creature images cannot be previewed", async () => {
                        await truffleAssert.reverts(
                            witmon.previewCreatureImage(
                                eggOwner0,
                                0,
                                1,
                                800,
                                2,
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "not in Hatching"
                        )
                    })
                })
            })
            describe("IWitmonView", async () => {
                describe("getCreatureStatus(..)", async () => {
                    it("creature #0 is in 'Incubating' status", async() => {
                        let cStatus = await witmon.getCreatureStatus.call(0)
                        assert.equal(cStatus.toString(), "1")
                    })
                })
            })
            describe("IWitmonAdmin", async() => {
                describe("setDecorator(..)", async () => {
                    it("signator cannot change decorator", async () => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(stranger, { from: signator }),
                            "Ownable"
                        )
                    })
                    it("stranger cannot change decorator", async() => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(stranger, { from: stranger }),
                            "Ownable"
                        )
                    })
                    it("decorator cannot be set to zero", async () => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(
                                "0x0000000000000000000000000000000000000000",
                                { from: owner }
                            ),
                            "no decorator"
                        )
                    })
                    it("owner can change decorator", async() => {
                        await witmon.setDecorator(WitmonLiscon21.address, { from: owner })
                    })
                })
                describe("setParameters(..)", async () => {
                    it("owner cannot change valid parameters", async () => {
                        await truffleAssert.reverts(
                            witmon.setParameters(
                                signator,
                                [10, 30, 60],
                                80640,
                                { from: owner }
                            ),
                            "not in Batching"
                        )
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
                    it("owner cannot stop batching", async() => {
                        await truffleAssert.reverts(
                            witmon.stopBatching({ 
                                from: owner,
                                value: 10 ** 10 // 10 gwei
                            }),
                            "not in Batching"
                        )
                    })
                })
                describe("startHatching()", async () => {
                    it("signator cannot start hatching", async() => {
                        await truffleAssert.reverts(
                            witmon.startHatching({ from: signator }),
                            "Ownable"
                        )
                    })
                    it("stranger cannot start hatching", async() => {
                        await truffleAssert.reverts(
                            witmon.startHatching({ from: stranger }),
                            "Ownable"
                        )
                    })
                    it("owner can start hatching", async () => {
                        await witmon.startHatching({ from: owner })
                        // check status changed to 'Hatching'
                        let status = await witmon.getStatus.call()
                        assert.equal(status.toString(), "2")
                    })
                })
            })
        })

        describe("In status: 'Hatching'", async () => {
            beforeEach(async () => {
                let status = await witmon.getStatus.call()
                assert.equal(status.toString(), "2")
            })
            describe("IWitmonAdmin", async() => {
                describe("setDecorator(..)", async () => {
                    it("signator cannot change decorator", async () => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(stranger, { from: signator }),
                            "Ownable"
                        )
                    })
                    it("stranger cannot change decorator", async() => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(stranger, { from: stranger }),
                            "Ownable"
                        )
                    })
                    it("decorator cannot be set to zero", async () => {
                        await truffleAssert.reverts(
                            witmon.setDecorator(
                                "0x0000000000000000000000000000000000000000",
                                { from: owner }
                            ),
                            "no decorator"
                        )
                    })
                    it("owner can change decorator", async() => {
                        await witmon.setDecorator(WitmonLiscon21.address, { from: owner })
                    })
                })
                describe("setParameters(..)", async () => {
                    it("owner cannot change valid parameters", async () => {
                        await truffleAssert.reverts(
                            witmon.setParameters(
                                signator,
                                [10, 30, 60],
                                80640,
                                { from: owner }
                            ),
                            "not in Batching"
                        )
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
                    it("owner cannot stop batching", async() => {
                        await truffleAssert.reverts(
                            witmon.stopBatching({ 
                                from: owner,
                                value: 10 ** 10 // 10 gwei
                            }),
                            "not in Batching"
                        )
                    })
                })
                describe("startHatching()", async () => {
                    it("signator cannot re-start hatching", async() => {
                        await truffleAssert.reverts(
                            witmon.startHatching({ from: signator }),
                            "Ownable"
                        )
                    })
                    it("stranger cannot re-start hatching", async() => {
                        await truffleAssert.reverts(
                            witmon.startHatching({ from: stranger }),
                            "Ownable"
                        )
                    })
                    it("owner cannot re-start hatching", async() => {
                        await truffleAssert.reverts(
                            witmon.startHatching({ from:owner }),
                            "not in Randomizing"
                        )
                    })
                })
            })
            describe("IWitmonSurrogates", async() => {
                describe("mintCreature(..)", async () => {
                    it("fails if trying to malleate egg owner when minting a new creature", async () => {
                        await truffleAssert.reverts(
                            witmon.mintCreature(
                                stranger,   // _eggOwner
                                0,          // _eggIndex
                                1,          // _eggRanking
                                800,        // _eggScore
                                2,          // _totalEggs
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "bad signature"
                        )
                    })
                    it("fails if trying to malleate egg index when minting a new creature", async () => {
                        await truffleAssert.reverts(
                            witmon.mintCreature(
                                eggOwner0,
                                1,
                                1,
                                800,
                                2,
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "bad signature"
                        )
                    })
                    it("fails if trying to malleate egg score when minting a new creature", async () => {
                        await truffleAssert.reverts(
                            witmon.mintCreature(
                                eggOwner0,
                                0,
                                1,
                                1800,
                                2,
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "bad signature"
                        )
                    })
                    it("fails if trying to malleate egg ranking when minting a new creature", async () => {
                        await truffleAssert.reverts(
                            witmon.mintCreature(
                                eggOwner0,
                                0,
                                2,
                                800,
                                2,
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "bad signature"
                        )
                    })
                    it("fails if trying to malleate totally claimed eggs when minting a new creature", async () => {
                        await truffleAssert.reverts(
                            witmon.mintCreature(
                                eggOwner0,
                                0,
                                1,
                                800,
                                25,
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b"
                            ),
                            "bad signature"
                        )
                    })
                    it("new creature can be minted by anyone", async () => {
                        await witmon.mintCreature(
                            eggOwner0,
                            0, // _eggIndex
                            1, // _eggRanking
                            800, // _eggScore
                            2, // _eggTotalClaimedEggs
                            // eslint-disable-next-line max-len
                            "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b",
                            { from: stranger }
                        )
                        // checks that creature #0 is now in 'Alive' status:
                        let _status = await witmon.getCreatureStatus.call(0)
                        assert.equal(_status.toString(), "3")
                        // checks the new creature was assigned 1 as tokenId:
                        let _data = await witmon.getCreatureData.call(0)
                        assert.equal(_data.tokenId.toString(), "1")
                    })
                    it("minted creature cannot be minted twice", async () => {
                        truffleAssert.reverts(
                            witmon.mintCreature(
                                eggOwner0,
                                0, // _eggIndex
                                1, // _eggRanking
                                800, // _eggScore
                                2, // _eggTotalClaimedEggs
                                // eslint-disable-next-line max-len
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b",
                                { from: stranger }
                            ),
                            "already minted"
                        )
                    })
                })
                describe("previewCreature(..)", async() => {
                    it("minted creature can be previewed by anyone", async () => {
                        witmon.previewCreatureImage(
                            eggOwner0,
                            0, // _eggIndex
                            1, // _eggRanking
                            800, // _eggScore                            
                            2, // _eggTotalClaimedEggs
                            // eslint-disable-next-line max-len
                            "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b",
                            { from: stranger }
                        )
                        // checks that creature #0 continues in 'Hatching' status:
                        let _status = await witmon.getCreatureStatus.call(0)
                        assert.equal(_status.toString(), "3")
                        // console.log(
                            await witmon.previewCreatureImage.call(
                                eggOwner0,
                                0, // _eggIndex
                                1, // _eggRanking
                                800, // _eggScore                                
                                2, // _eggTotalClaimedEggs
                                // eslint-disable-next-line max-len
                                "0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b",
                                { from: stranger }
                            )
                        // )
                    })
                    it("unminted creature can by previewed by anyone", async () => {
                        // TODO
                    })
                })
            })
            describe("IWitmonView", async () => {
                describe("getCreatureData(_eggIndex)", async () => {
                    it("data of a previously minted creature should be valid", async () => {
                        let data = await witmon.getCreatureData.call(0)
                        console.log(data)
                        assert.equal(data.tokenId.toString(), "1")
                        assert.equal(data.eggIndex.toString(), "0")
                        assert.equal(data.eggScore.toString(), "800")
                        assert.equal(data.eggRanking.toString(), "1")
                        assert.equal(data.eggCategory.toString(), "2")
                    })
                })
                describe("getCreatureImage(_eggIndex)", async () => {
                    it("getting image from minted creature works", async () => {
                        let image = await witmon.getCreatureImage.call(0)
                        // console.log(image)
                    })
                    it("getting image from unminted creature fails", async () => {
                        await truffleAssert.reverts(
                            witmon.getCreatureImage.call(1),
                            "not alive yet"
                        )
                    })
                })
                describe("getCreatureStatus(_eggIndex)", async () => {
                    it("creature #0 is in 'Alive' status", async() => {
                        let cStatus = await witmon.getCreatureStatus.call(0)
                        assert.equal(cStatus.toString(), "3")
                    })
                    it("creature #1 is in 'Hatching' status", async() => {
                        let cStatus = await witmon.getCreatureStatus.call(1)
                        assert.equal(cStatus.toString(), "2")
                    })
                })
                describe("getStats()", async () => {
                    it("totalSupply should have increased to 1", async() => {
                        let totalSupply = await witmon.getStats.call()
                        assert.equal(totalSupply.toString(), "1")
                    })
                })
            })
            describe("ERC721", async () => {
                describe("metadata(_tokenId)", async () => {
                    it("metadata of a previously minted creature should be valid", async () => {
                        let metadata = await witmon.metadata.call(1)
                        // console.log(metadata)
                        // remove non-printable and other non-valid JSON chars
                        metadata = metadata.replace(/[\u0000-\u0019]+/g,""); 
                        metadata = JSON.parse(metadata)
                        assert.equal(metadata.external_url, "https://wittycreatures.com/creatures/0")
                    })
                    it("getting metadata from inexistent token fails", async () => {
                        await truffleAssert.reverts(
                            witmon.metadata.call(2),
                            "inexistent token"
                        )
                    })
                })
                describe("tokenURI(_tokenId)", async () => {
                    it("tokenURI of a previously minted creature should be valid", async () => {
                        let tokenURI = await witmon.tokenURI.call(1)
                        assert.equal(tokenURI, "https://wittycreatures.com/creatures/0")
                    })
                    it("getting tokenURI from inexistent token fails", async () => {
                        await truffleAssert.reverts(
                            witmon.tokenURI.call(2),
                            "inexistent token"
                        )
                    })
                })
                // describe("transfer(..)", async () => {
                //     it("", async () => {
                //     })
                //     // TODO
                // })
            })
        })
    })
})