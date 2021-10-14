const fs = require("fs")
const witmonAddresses = require("./witmon.addresses.json")
const WitmonLiscon21 = artifacts.require("WitmonLiscon21");
module.exports = async function (deployer, network) {
  network = network.split("-")[0]
  if (network !== "test") {
    if (!witmonAddresses[network]) {
      witmonAddresses[network] = {}
    }
    if (!witmonAddresses[network].WitmonLiscon21) {
      witmonAddresses[network].WitmonLiscon21 = ""
    }
    if (witmonAddresses[network].WitmonLiscon21 === "") {
      await deployer.deploy(WitmonLiscon21, "https://wittycreatures.com/metadata/")
      witmonAddresses[network].WitmonLiscon21 = WitmonLiscon21.address
      fs.writeFileSync("./migrations/witmon.addresses.json", JSON.stringify(witmonAddresses, null, 4), { flag: 'w+' })
    } else {
      WitmonLiscon21.address = witmonAddresses[network].WitmonLiscon21
      console.info("   > Skipped: presumably deployed at", WitmonLiscon21.address)
    }
  } else {
    await deployer.deploy(WitmonLiscon21, "https://wittycreatures.com/metadata/");
  }
  let tx, gasUsed = 0
  let decorator = await WitmonLiscon21.at(WitmonLiscon21.address)
  let forged = await decorator.forged.call()
  if (!forged) {
    console.info("   > Setting missing art pieces:")
    let artItems = await decorator.getArtSpecies.call()
    if (artItems.length == 0) {
      console.info("     >> Species...")
      tx = await decorator.setArtSpecies(
        [
          ["Witnet", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["AAVE", "<path d='m15 3v1h-3v1h-2v1h-1v1h-2v1h-1v2h-1v20h1v1h2v-1h1v-4h1v3h1v1h2v-1h1v-3h1v4h1v1h2v-1h1v-4h1v2h1v1h2v-1h1v-2h1v4h1v1h2v-1h1v-20h-1v-2h-1v-1h-1v-1h-2v-1h-1v-1h-3v-1h-5z' fill='#fff'/><path d='m9 12v1h-1v3h1v1h2v-1h1v-3h-1v1h-1v-1h1v-1h-2zm10 0v1h-1v3h1v1h2v-1h1v-3h-1v1h-1v-1h1v-1h-2z' class='b'/><path d='m13 19v1h1v1h2v-1h1v-1h-4z' fill='#888'/>"],
          ["Uniswap", "<path d='m15 3v1h-3v1h-2v1h-1v1h-2v1h-1v2h-1v20h1v1h2v-1h1v-4h1v3h1v1h2v-1h1v-3h1v4h1v1h2v-1h1v-4h1v2h1v1h2v-1h1v-2h1v4h1v1h2v-1h1v-20h-1v-2h-1v-1h-1v-1h-2v-1h-1v-1h-3v-1h-5z' fill='#fff'/><path d='m9 12v1h-1v3h1v1h2v-1h1v-3h-1v1h-1v-1h1v-1h-2zm10 0v1h-1v3h1v1h2v-1h1v-3h-1v1h-1v-1h1v-1h-2z' class='b'/><path d='m13 19v1h1v1h2v-1h1v-1h-4z' fill='#888'/>"],
          ["Metamask", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["Aragon", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["Gnosis", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["Kusama", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["NEAR", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["Chainlink", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["Carlos", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["Dogecoin", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
          ["Conflux", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>"],
        ],
      )
      gasUsed += tx.receipt.gasUsed
    }
    artItems = await decorator.getArtBackgrounds.call()
    if (artItems.length == 0) {
      console.info("     >> Backgrounds...")
      tx = await decorator.setArtBackgrounds(
        [
          ["", ""],
          ["Lisbon", ""],
          ["Cloudy", ""],
          ["Tronic", ""],
          ["Rainbow", ""],
          ["Hell", ""],
        ],
      )
      gasUsed += tx.receipt.gasUsed
    }
    artItems = await decorator.getArtEyewears.call()
    if (artItems.length == 0) {
      console.info("     >> Eyewears...")
      tx = await decorator.setArtEyewears(
        [
          ["", ""],
          ["Thug Life", "<path d='m6 13v1h1v1h1v1h1v1h3v-1h1v-1h1v-1h2v1h1v1h1v1h3v-1h1v-1h1v-1h1v-1h-18z' class='c'/><path d='m7 13v1h1v-1h-1zm1 1v1h1v-1h-1zm1 0h1v-1h-1v1zm1 0v1h1v-1h-1zm1 1v1h1v-1h-1zm-1 0h-1v1h1v-1zm6-2v1h1v-1h-1zm1 1v1h1v-1h-1zm1 0h1v-1h-1v1zm1 0v1h1v-1h-1zm1 1v1h1v-1h-1zm-1 0h-1v1h1v-1z' fill='#fff'/>"],
          ["Groucho", "<path d='m8 8v3h6v-3zm8 0v3h6v-3zm-7 9v4h2v-1h8v1h2v-4z' fill='333'/><path d='m14 11v5h-1v1h1v1h2v-1h1v-1h-1v-5z' fill='#fda'/><path class='c' d='m9 11v1h4v-1zm4 1v4h1v-3h2v3h1v-4zm4 0h4v-1h-4zm4 0v4h1v-4zm0 4h-4v1h4zm-8 0h-4v1h4zm-4 0v-4h-1v4z'/><path d='m9 12v4h4v-4zm8 0v4h4v-4z' fill='#fff' opacity='.2'/>"],
          ["John Lennon", "<path d='m9 11v1h3v-1zm3 1v1h1v-1zm1 1v2h1v-1h2v1h1v-2zm4 0h1v-1h-1zm1-1h3v-1h-3zm3 0v1h1v-1zm1 1v2h1v-2zm0 2h-1v1h1zm-1 1h-3v1h3zm-3 0v-1h-1v1zm-5-1h-1v1h1zm-1 1h-3v1h3zm-3 0v-1h-1v1zm-1-1v-2h-1v2zm0-2h1v-1h-1z' fill='#fc3'/><path class='c' d='m12 12h-3v1h-1v2h1v1h3v-1h1v-2h-1zm9 1h1v2h-1v1h-3v-1h-1v-2h1v-1h3z' opacity='.5'/>"],
          ["Laser eyes", "<g class='b'><path d='m13 11h-5v1h-1v3h1v1h5v-1h1v-3h-1zm9 0h-5v1h-1v3h1v1h5v-1h1v-3h-1z' opacity='.7'/><path d='m13 12h1v3h1v2h3v-1h-1v-1h-1v-3h-1v-2h-3v1h1zm-8 0h2v3h1v1h1v1h-3v-2h-1zm20 0h-1v-2h-3v1h1v1h1v3h2z' opacity='.5'/><path d='m16 11h-1v-1h-1v-1h3v1h-1zm-11 2h-4v1h4zm20 0h4v1h-4zm-20 3h1v1h1v1h-3v-1h1zm10 0h-1v1h-1v1h3v-1h-1zm9-5h1v-1h1v-1h-3v1h1z' opacity='.3'/><path d='m18 10h-1v-1h-1v-1h2v-1h2v1h-1v1h-1zm-15 2h2v1h-2zm2 2h-2v1h2zm22 1v-1h-2v1zm0-2v-1h-2v1zm-27 0h1v1h-1zm29 0h3v1h-3zm-26 4h1v1h1v1h-2v1h-2v-1h1v-1h1zm10 0h-1v1h-1v1h-1v1h2v-1h2v-1h-1zm13-7h1v-1h1v-1h1v-1h-2v1h-2v1h1z' opacity='.1'/></g><path d='m11 13h-1v1h1zm9 0h-1v1h1z' fill='#ffa'/><rect y='13' width='32' height='1' fill='#ffa' opacity='.3'/>"],
          ["Monocle", "<path d='m8 8v3h6v-3zm8 0v3h6v-3zm-7 9v4h2v-1h8v1h2v-4z' fill='333'/><path d='m14 11v5h-1v1h1v1h2v-1h1v-1h-1v-5z' fill='#fda'/><path class='c' d='m9 11v1h4v-1zm4 1v4h1v-3h2v3h1v-4zm4 0h4v-1h-4zm4 0v4h1v-4zm0 4h-4v1h4zm-8 0h-4v1h4zm-4 0v-4h-1v4z'/><path d='m9 12v4h4v-4zm8 0v4h4v-4z' fill='#fff' opacity='.2'/>"],
          ["Pirate patch", "<g class='b'><path d='m13 11h-5v1h-1v3h1v1h5v-1h1v-3h-1zm9 0h-5v1h-1v3h1v1h5v-1h1v-3h-1z' opacity='.7'/><path d='m13 12h1v3h1v2h3v-1h-1v-1h-1v-3h-1v-2h-3v1h1zm-8 0h2v3h1v1h1v1h-3v-2h-1zm20 0h-1v-2h-3v1h1v1h1v3h2z' opacity='.5'/><path d='m16 11h-1v-1h-1v-1h3v1h-1zm-11 2h-4v1h4zm20 0h4v1h-4zm-20 3h1v1h1v1h-3v-1h1zm10 0h-1v1h-1v1h3v-1h-1zm9-5h1v-1h1v-1h-3v1h1z' opacity='.3'/><path d='m18 10h-1v-1h-1v-1h2v-1h2v1h-1v1h-1zm-15 2h2v1h-2zm2 2h-2v1h2zm22 1v-1h-2v1zm0-2v-1h-2v1zm-27 0h1v1h-1zm29 0h3v1h-3zm-26 4h1v1h1v1h-2v1h-2v-1h1v-1h1zm10 0h-1v1h-1v1h-1v1h2v-1h2v-1h-1zm13-7h1v-1h1v-1h1v-1h-2v1h-2v1h1z' opacity='.1'/></g><path d='m11 13h-1v1h1zm9 0h-1v1h1z' fill='#ffa'/><rect y='13' width='32' height='1' fill='#ffa' opacity='.3'/>"],
        ]
      )
      gasUsed += tx.receipt.gasUsed
    }
    artItems = await decorator.getArtHats.call()
    if (artItems.length == 0) {
      console.info("     >> Hats...")
      tx = await decorator.setArtHats(
        [
          ["Headphones", "<path d='m7 11h-4v8h4zm17 0h4v8h-4z' fill='#555'/><path class='d' d='m9 2v1h-2v1h-1v1h-1v1h-1v2h-1v2h2v-1h1v-2h1v-1h1v-1h2v-1h11v1h2v1h1v1h1v2h1v1h2v-2h-1v-2h-1v-1h-1v-1h-1v-1h-2v-1zm19 11h2v4h-2zm-25 0h-2v4h2z'/><path d='m2 10v3h1v-2h2v-1h-3zm24 0v1h2v2h1v-3h-3zm-24 7v6h1v-6h-1zm1 6v4h1v-4h-1zm1 4v2h1v-2h-1zm1 2v1h1v-1h-1zm1 1v1h1v-1h-1zm1 1v1h1v-1h-1zm21-14v5h1v-5h-1zm0 5h-1v2h1v-2zm-1 2h-1v2h1v-2zm-1 2h-1v2h1v-2zm-1 2h-1v1h1v-1zm-1 1h-1v1h1v-1zm-1 1h-2v1h2v-1zm-2 1h-2v1h2v-1z' fill='#ccc'/>"],
          ["Cowboy", "<path class='d' d='m16 1h-6v2h-2v4h-1v-1h-3v4h1v1h1v1h3v1h2v1h6v-1h4v-1h4v-1h3v-2h1v-3h-2v1h-1v-5h-2v-1h-6v1h-2z'/><path d='m16 2v1h1v-1zm0 1h-2v1h2zm-2 1h-1v1h1zm-7 3v2h1v-2zm1 2v1h1v-1zm1 1v1h1v-1zm1 1v2h1v-2zm1 2v1h6v-1zm6 0h1v-2h-1zm1-2h1v-1h-1zm1-1h5v-1h-5zm5-1h2v-1h-2zm2-1h1v-1h-1z' opacity='.1'/><path d='m9 8h-1v1h1v1h1v1h1v1h6v-1h1v-1h1v-1h-2v1h-5v-1h-2v-1z' opacity='.5'/>"],
          ["Tiara", "<path class='d' d='m17 1h-2v1h-2v1h-2v1h-1v1h-1v1h-1v2h-2v4h2v-2h1v-1h2v-1h3v1h3v-1h4v1h2v1h2v1h2v1h1v-3h-1v-2h-2v-2h-2v-1h-2v-1h-1v-1h-3z'/><path class='b' d='m17 3h-3v1h-1v3h1v1h3v-1h1v-3h-1z'/><path d='m14 3v1h1v-1zm1 1v1h1v-1zm1 0h1v-1h-1zm-1 1h-1v1h1zm-1 1h-1v1h1zm0-1v-1h-1v1z' fill='#fff' opacity='.3'/><path d='m14 2v1h3v-1zm3 1v3h-1v1h-3v1h1v1h3v-1h1v-1h1v-3h-1v-1zm-4 4v-3h-1v3zm0-3h1v-1h-1z' opacity='.1'/>"],
          ["Samurai", "<path class='d' d='m17 1h-2v1h-2v1h-2v1h-1v1h-1v1h-1v2h-2v4h2v-2h1v-1h2v-1h3v1h3v-1h4v1h2v1h2v1h2v1h1v-3h-1v-2h-2v-2h-2v-1h-2v-1h-1v-1h-3z'/><path class='b' d='m17 3h-3v1h-1v3h1v1h3v-1h1v-3h-1z'/><path d='m14 3v1h1v-1zm1 1v1h1v-1zm1 0h1v-1h-1zm-1 1h-1v1h1zm-1 1h-1v1h1zm0-1v-1h-1v1z' fill='#fff' opacity='.3'/><path d='m14 2v1h3v-1zm3 1v3h-1v1h-3v1h1v1h3v-1h1v-1h1v-3h-1v-1zm-4 4v-3h-1v3zm0-3h1v-1h-1z' opacity='.1'/>"],
          ["Topper", "<path class='d' d='m17 1h-2v1h-2v1h-2v1h-1v1h-1v1h-1v2h-2v4h2v-2h1v-1h2v-1h3v1h3v-1h4v1h2v1h2v1h2v1h1v-3h-1v-2h-2v-2h-2v-1h-2v-1h-1v-1h-3z'/><path class='b' d='m17 3h-3v1h-1v3h1v1h3v-1h1v-3h-1z'/><path d='m14 3v1h1v-1zm1 1v1h1v-1zm1 0h1v-1h-1zm-1 1h-1v1h1zm-1 1h-1v1h1zm0-1v-1h-1v1z' fill='#fff' opacity='.3'/><path d='m14 2v1h3v-1zm3 1v3h-1v1h-3v1h1v1h3v-1h1v-1h1v-3h-1v-1zm-4 4v-3h-1v3zm0-3h1v-1h-1z' opacity='.1'/>"],
        ]
      )
      gasUsed += tx.receipt.gasUsed
    }
    console.info("     >> Forging WitmonLiscon21 decorator at", decorator.address)
    tx = await decorator.forge()
    gasUsed += tx.receipt.gasUsed
    console.info("     >> Cumuled gas used:", gasUsed)
    console.info()
  }
};
