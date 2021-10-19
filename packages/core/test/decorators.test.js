const { assert } = require("chai")
const truffleAssert = require("truffle-assertions")
const WitmonLiscon21 = artifacts.require("WitmonLiscon21")

contract("WitmonLiscon21", _accounts => {
    let decorator
    const phenotype1 = "0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2"

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

            describe("Full range generation", async () => {
                it("common creatures", async () => {
                    for (let j = 0; j < 50; j ++) {
                        metadata = await decorator.getCreatureMetadata.call([
                            j,
                            0,
                            j,
                            10000 - j * 100,
                            j + 1,
                            "0x" + ("0".repeat(64 - j.toString(16).length)) + j.toString(16),
                            2
                        ])
                        metadata = JSON.parse(metadata)
                        console.log(j, "=>", metadata.attributes)
                    }
                })
                it("rare creatures", async () => {
                    for (let j = 50; j < 100; j ++) {
                        metadata = await decorator.getCreatureMetadata.call([
                            j,
                            0,
                            j,
                            10000 - j * 100,
                            j + 1,
                            "0x" + ("0".repeat(64 - j.toString(16).length)) + j.toString(16),
                            1
                        ])
                        metadata = JSON.parse(metadata)
                        console.log(j, "=>", metadata.attributes)
                    }
                })
                it("legendary creatures", async () => {
                    for (let j = 100; j < 150; j ++) {
                        metadata = await decorator.getCreatureMetadata.call([
                            j,
                            0,
                            j,
                            50000 - j * 100,
                            j + 1,
                            "0x" + ("0".repeat(64 - j.toString(16).length)) + j.toString(16),
                            0
                        ])
                        metadata = JSON.parse(metadata)
                        console.log(j, "=>", metadata.attributes)
                    }
                })
            })

            describe("Common creature", async () => {
                let creature = [
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
                it("contains no eyewear attribute", async () => {
                    // console.log(metadata.attributes)
                    assert(
                        metadata.attributes.filter(val => {
                            if (val.trait_type && val.trait_type === "Eyewear") {
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
