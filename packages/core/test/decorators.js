const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WitmonLiscon21 = artifacts.require("WitmonLiscon21")

contract("WitmonLiscon21", accounts => {
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
            it("ends with slash", () => {
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
            it("performing full range test works", async () => {
                for (let j = 1 ; j < 256; j ++) {
                    await decorator.randomUniform.call(phenotype1, j, j)
                }  
            })
            // it("uniformity", async () => {
            //     let hist = []
            //     hist.length = 17
            //     for (let j = 0 ; j < 1000; j ++) {
            //         let rnd = await decorator.randomUniform.call(phenotype2, j, 17)
            //         hist[rnd] = hist[rnd] ? hist[rnd] + 1 : 1
            //     }  
            //     console.log(JSON.stringify(hist))
            // })
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
                    /* eggColorIndex */ 4,
                    /* eggScore      */ 837,
                    /* eggRanking    */ 7,
                    /* eggPhenotype  */ phenotype1,
                    /* eggCategory   */ 0
                ]
                it("generates valid JSON", async() => {
                    metadata = await decorator.getCreatureMetadata.call(creature)
                    console.log(metadata)
                    // TODO
                })
                it("name contains token id", async () => {
                    // TODO
                })
                it("external url contains egg index", async () => {
                    // TODO
                })
                it("common creature contains no background", async () => {
                    // TODO
                })
                it("common creature contains no neckware", async () => {
                    // TODO
                })
            })
            describe("Rare creature", async () => { /* idem */ })
            describe("Legendary creature", async () => { /* idem */})
        })

        describe("getCreatureImage(Creature)", async() => {
        })
    })

})  