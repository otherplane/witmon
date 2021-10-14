const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WitmonLiscon21 = artifacts.require("WitmonLiscon21")

contract("WitmonLiscon21", _accounts => {
    let decorator
    const phenotype1 = "0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2"
    const phenotype2 = "0x4c02520952d3cafd935937821f75182303d2b419b92d6af88eb9374753fb3f88"

    before(async () => {
        decorator = await WitmonLiscon21.deployed()
    })

    describe("WitmonDecoratorBase", async () => {
        describe("baseURI()", async () => {
            let baseURI
            it("returns no empty string", async () => {
                baseURI = await decorator.baseURI.call()
                assert(baseURI.length > 0)
            })
            it("ends up with slash", () => {
                assert(baseURI[baseURI.length - 1] === "/")
            })
        })
        describe("randomUniform(bytes32,uint256,uint8)", async () => {
            it("zero range fails", async () => {
                await truffleAssert.reverts(
                    decorator.randomUniform.call(phenotype1, 0, 0),
                    "VM Exception"
                )
            })
            it("variable result when called with same seed and range but different phenotype", async () => {
                let rnd1 = await decorator.randomUniform.call(phenotype1, 0, 254)
                let rnd2 = await decorator.randomUniform.call(phenotype2, 0, 254)
                assert(rnd1.toString() !== rnd2.toString())
            })
            it("variable result when called with same phenotype and range but different seed", async () => {
                let rnd1 = await decorator.randomUniform.call(phenotype1, 0, 128)
                let rnd2 = await decorator.randomUniform.call(phenotype1, 1, 128)
                assert(rnd1.toString() !== rnd2.toString())
            })
            it("same result when called with same parameters", async () => {
                let rnd1 = await decorator.randomUniform.call(phenotype2, 2, 4)
                let rnd2 = await decorator.randomUniform.call(phenotype2, 2, 4)
                assert.equal(rnd1.toString(), rnd2.toString())
            })
            // it("performing full range test works", async () => {
            //     for (let j = 1 ; j < 256; j ++) {
            //         await decorator.randomUniform.call(phenotype1, j, j)
            //     }  
            // })
            // // it("uniformity", async () => {
            // //     let hist = []
            // //     hist.length = 17
            // //     for (let j = 0 ; j < 1000; j ++) {
            // //         let rnd = await decorator.randomUniform.call(phenotype2, j, 17)
            // //         hist[rnd] = hist[rnd] ? hist[rnd] + 1 : 1
            // //     }  
            // //     console.log(JSON.stringify(hist))
            // // })
        })        
        describe("randomUniformBase2(bytes32,uint256,uint8)", async () => {
            it("zero bits fails", async () => {
                await truffleAssert.reverts(
                    decorator.randomUniformBase2.call(phenotype1, 0, 0),
                    "VM Exception"
                )
            })
            it("more than 8 bits fails", async () => {
                await truffleAssert.reverts(
                    decorator.randomUniformBase2.call(phenotype1, 0, 9),
                    "VM Exception"
                )
            })
            it("variable result when called with same seed and range but different phenotype", async () => {
                let rnd1 = await decorator.randomUniformBase2.call(
                    phenotype1,
                    0,
                    8
                )
                let rnd2 = await decorator.randomUniformBase2.call(
                    phenotype2,
                    0,
                    8
                )
                assert(rnd1.toString() !== rnd2.toString())
            })
            it("variable result when called with same phenotype and range but different seed", async () => {
                let rnd1 = await decorator.randomUniformBase2.call(
                    phenotype1,
                    0,
                    8
                )
                let rnd2 = await decorator.randomUniformBase2.call(
                    phenotype1,
                    1,
                    8
                )
                assert(rnd1.toString() !== rnd2.toString())
            })
            it("same result when called with same parameters", async () => {
                let rnd1 = await decorator.randomUniformBase2.call(
                    phenotype2,
                    2,
                    8
                )
                let rnd2 = await decorator.randomUniformBase2.call(
                    phenotype2,
                    2,
                    8
                )
                assert.equal(rnd1.toString(), rnd2.toString())
            })
            it("performing full range test works", async () => {
                for (let j = 1 ; j < 9; j ++) {
                    await decorator.randomUniformBase2.call(phenotype1, j, j)
                }  
            })
        })
    })
  
    describe("IWitmonDecorator", async () => {
        describe("getCreatureMetadata(Creature)", async () => {
            let metadata
            describe("Common creature", async () => {
                const creature = [
                    /* tokenId       */ 77,
                    /* eggBirth      */ 0,
                    /* eggIndex      */ 17,
                    /* eggScore      */ 837,
                    /* eggRanking    */ 107,
                    /* eggPhenotype  */ phenotype1,
                    /* eggCategory   */ 2
                ]
                it("generates valid JSON", async() => {
                    metadata = await decorator.getCreatureMetadata.call(creature)
                    // remove non-printable and other non-valid JSON chars
                    metadata = JSON.parse(metadata)
                })
                it("name contains token id", async () => {
                    assert(metadata.name.indexOf(creature[0].toString()) >= 0);
                })
                it("external url contains token id", async () => {
                    assert(metadata.external_url.indexOf(creature[0].toString()) >= 0);
                })
                it("contains no neckware attribute", async () => {
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Neckwear") {
                                return val;
                            }
                        }).length == 0
                    )
                })
                it("contains no background attribute", async () => {
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Background") {
                                return val;
                            }
                        }).length == 0
                    )
                })
            })
            describe("Rare creature", async () => { 
                const creature = [
                    /* tokenId       */ 66,
                    /* eggBirth      */ 0,
                    /* eggIndex      */ 13,
                    /* eggScore      */ 1837,
                    /* eggRanking    */ 67,
                    /* eggPhenotype  */ phenotype1,
                    /* eggCategory   */ 1
                ]
                it("generates valid JSON", async() => {
                    metadata = await decorator.getCreatureMetadata.call(creature)
                    // remove non-printable and other non-valid JSON chars
                    metadata = JSON.parse(metadata)
                })
                it("name contains token id", async () => {
                    assert(metadata.name.indexOf(creature[0].toString()) >= 0);
                })
                it("external url contains token index", async () => {
                    assert(metadata.external_url.indexOf(creature[0].toString()) >= 0);
                })
                it("contains neckware attribute", async () => {
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Neckwear") {
                                return val;
                            }
                        }).length == 1
                    )
                })
                it("contains no background attribute", async () => {
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Background") {
                                return val;
                            }
                        }).length == 0
                    )
                })
            })
            describe("Legendary creature", async () => {
                const creature = [
                    /* tokenId       */ 466,
                    /* eggBirth      */ 0,
                    /* eggIndex      */ 163,
                    /* eggScore      */ 1837,
                    /* eggRanking    */ 67,
                    /* eggPhenotype  */ phenotype1,
                    /* eggCategory   */ 0
                ]
                it("generates valid JSON", async() => {
                    metadata = await decorator.getCreatureMetadata.call(creature)
                    // remove non-printable and other non-valid JSON chars
                    metadata = JSON.parse(metadata)
                })
                it("name contains token id", async () => {
                    assert(metadata.name.indexOf(creature[0].toString()) >= 0);
                })
                it("external url contains token index", async () => {
                    assert(metadata.external_url.indexOf(creature[0].toString()) >= 0);
                })
                it("contains neckware attribute", async () => {
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Neckwear") {
                                return val;
                            }
                        }).length == 1
                    )
                })
                it("contains background attribute", async () => {
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Background") {
                                return val;
                            }
                        }).length == 1
                    )
                })
            })
        })
        // describe("getCreatureImage(Creature)", async () => {
        //     // TODO
        // })
    })
})
