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
                    // console.log(metadata)
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
                    // console.log(metadata.attributes)
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
                it("contains eyewear attribute", async () => {
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Eyewear") {
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
                it("contains eyewear attribute", async () => {
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Eyewear") {
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
    })
})
