// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./WitmonDecoratorBase.sol";

contract WitmonLiscon21
    is
        WitmonDecoratorBase
{
    using Strings for uint256;
   
    struct TraitIndexes {
        uint8 baseColor;
        uint8 background;
        uint8 eyesColor;
        uint8 eyewear;
        uint8 eyewearColor;
        uint8 hat;
        uint8 hatColor;
        uint8 neckwear;
        uint8 species;
    }
   struct Art {
        string[] colors;
        mapping(uint256 => Item) species;
        mapping(uint256 => Item) backgrounds;
        mapping(uint256 => Item) eyewears;
        mapping(uint256 => Item) hats;
        mapping(uint256 => Item) neckwears;
    }

    struct Item {
        bytes12 name;
        string svg;
    }

    Art internal art;

    constructor(string memory _baseURI)
        WitmonDecoratorBase(_baseURI)
    {
        art.colors = [
            "ebebf7",
            "1c1d2f", 
            "cc0d3d",
            "d22f94",
            "890ec1", 
            "1c49d8",
            "19b554"
        ];

        art.species[0] = Item("Witnet", "<path d='m7 24v2h-2v2h-2v4h28v-4h-1v-2h-3v-2z' fill='#558'/><path d='m21 0v1h-1v1h-1v1h-2v1h-2v1h-5v1h-1v1h-1v1 1h-1v1 12 1 1 1h1v1h1v1h1v1h10v-1h2v-1h2v-1h1v-1h1v-1h1v-1h1v-3h1v1h1v1h1v1h1v-3h-1v-2h-1v-2h-1v-2h-1v-2h1v1h2v-1-1h-1v-1h-1v-1-1h-1v-1h1v-1h1v-1h1v-1h-9v-1-1-1h-1z' fill='#8c9'/><path d='m10 12v3h2v-3zm9 0v3h2v-3z' class='b'/><path d='m9 15v1h2v1h2v-1h2v1h2v-1h1v-1zm9 1v1h3v-1zm3 1v3h1v1h3v-1h1v-3h-1v-1h-3v1zm-12-1h-1v4h1zm0 4v1h11v-1zm4 4v1h2v-1z' fill='#5a6'/><path d='m11 13v1h1v-1zm9 0v1h1v-1zm4 5v1h2v-1zm-14 3v1h3v-1zm4 0v1h3v-1z' fill='#fff'/><path d='m8 7v2h4v-2zm11 0v2h4v-2z' fill='#558'/>");
        art.species[1] = Item("AAVE", "<path d='m15 3v1h-3v1h-2v1h-1v1h-2v1h-1v2h-1v20h1v1h2v-1h1v-4h1v3h1v1h2v-1h1v-3h1v4h1v1h2v-1h1v-4h1v2h1v1h2v-1h1v-2h1v4h1v1h2v-1h1v-20h-1v-2h-1v-1h-1v-1h-2v-1h-1v-1h-3v-1h-5z' fill='#fff'/><path d='m9 12v1h-1v3h1v1h2v-1h1v-3h-1v1h-1v-1h1v-1h-2zm10 0v1h-1v3h1v1h2v-1h1v-3h-1v1h-1v-1h1v-1h-2z' class='b'/><path d='m13 19v1h1v1h2v-1h1v-1h-4z' fill='#888'/>");
        // ...

        art.backgrounds[0] = Item("", "");
        art.backgrounds[1] = Item("Lisbon", "...");
        art.backgrounds[2] = Item("Cloudy", "...");
        art.backgrounds[3] = Item("Tronic", "...");
        art.backgrounds[4] = Item("Rainbow", "...");
        art.backgrounds[5] = Item("Hell", "...");
        // ...

        art.eyewears[0] = Item("Thug Life", "<path d='m6 13v1h1v1h1v1h1v1h3v-1h1v-1h1v-1h2v1h1v1h1v1h3v-1h1v-1h1v-1h1v-1h-18z' class='c'/><path d='m7 13v1h1v-1h-1zm1 1v1h1v-1h-1zm1 0h1v-1h-1v1zm1 0v1h1v-1h-1zm1 1v1h1v-1h-1zm-1 0h-1v1h1v-1zm6-2v1h1v-1h-1zm1 1v1h1v-1h-1zm1 0h1v-1h-1v1zm1 0v1h1v-1h-1zm1 1v1h1v-1h-1zm-1 0h-1v1h1v-1z' fill='#fff'/>");
        art.eyewears[1] = Item("Groucho", "<path d='m8 8v3h6v-3zm8 0v3h6v-3zm-7 9v4h2v-1h8v1h2v-4z' fill='333'/><path d='m14 11v5h-1v1h1v1h2v-1h1v-1h-1v-5z' fill='#fda'/><path class='c' d='m9 11v1h4v-1zm4 1v4h1v-3h2v3h1v-4zm4 0h4v-1h-4zm4 0v4h1v-4zm0 4h-4v1h4zm-8 0h-4v1h4zm-4 0v-4h-1v4z'/><path d='m9 12v4h4v-4zm8 0v4h4v-4z' fill='#fff' opacity='.2'/>");
        art.eyewears[2] = Item("John Lennon", "<path d='m9 11v1h3v-1zm3 1v1h1v-1zm1 1v2h1v-1h2v1h1v-2zm4 0h1v-1h-1zm1-1h3v-1h-3zm3 0v1h1v-1zm1 1v2h1v-2zm0 2h-1v1h1zm-1 1h-3v1h3zm-3 0v-1h-1v1zm-5-1h-1v1h1zm-1 1h-3v1h3zm-3 0v-1h-1v1zm-1-1v-2h-1v2zm0-2h1v-1h-1z' fill='#fc3'/><path class='c' d='m12 12h-3v1h-1v2h1v1h3v-1h1v-2h-1zm9 1h1v2h-1v1h-3v-1h-1v-2h1v-1h3z' opacity='.5'/>");
        art.eyewears[3] = Item("Laser eyes", "<g class='b'><path d='m13 11h-5v1h-1v3h1v1h5v-1h1v-3h-1zm9 0h-5v1h-1v3h1v1h5v-1h1v-3h-1z' opacity='.7'/><path d='m13 12h1v3h1v2h3v-1h-1v-1h-1v-3h-1v-2h-3v1h1zm-8 0h2v3h1v1h1v1h-3v-2h-1zm20 0h-1v-2h-3v1h1v1h1v3h2z' opacity='.5'/><path d='m16 11h-1v-1h-1v-1h3v1h-1zm-11 2h-4v1h4zm20 0h4v1h-4zm-20 3h1v1h1v1h-3v-1h1zm10 0h-1v1h-1v1h3v-1h-1zm9-5h1v-1h1v-1h-3v1h1z' opacity='.3'/><path d='m18 10h-1v-1h-1v-1h2v-1h2v1h-1v1h-1zm-15 2h2v1h-2zm2 2h-2v1h2zm22 1v-1h-2v1zm0-2v-1h-2v1zm-27 0h1v1h-1zm29 0h3v1h-3zm-26 4h1v1h1v1h-2v1h-2v-1h1v-1h1zm10 0h-1v1h-1v1h-1v1h2v-1h2v-1h-1zm13-7h1v-1h1v-1h1v-1h-2v1h-2v1h1z' opacity='.1'/></g><path d='m11 13h-1v1h1zm9 0h-1v1h1z' fill='#ffa'/><rect y='13' width='32' height='1' fill='#ffa' opacity='.3'/>");
        // ...
        
        art.hats[0] = Item("Headphones", "<path d='m7 11h-4v8h4zm17 0h4v8h-4z' fill='#555'/><path class='d' d='m9 2v1h-2v1h-1v1h-1v1h-1v2h-1v2h2v-1h1v-2h1v-1h1v-1h2v-1h11v1h2v1h1v1h1v2h1v1h2v-2h-1v-2h-1v-1h-1v-1h-1v-1h-2v-1zm19 11h2v4h-2zm-25 0h-2v4h2z'/><path d='m2 10v3h1v-2h2v-1h-3zm24 0v1h2v2h1v-3h-3zm-24 7v6h1v-6h-1zm1 6v4h1v-4h-1zm1 4v2h1v-2h-1zm1 2v1h1v-1h-1zm1 1v1h1v-1h-1zm1 1v1h1v-1h-1zm21-14v5h1v-5h-1zm0 5h-1v2h1v-2zm-1 2h-1v2h1v-2zm-1 2h-1v2h1v-2zm-1 2h-1v1h1v-1zm-1 1h-1v1h1v-1zm-1 1h-2v1h2v-1zm-2 1h-2v1h2v-1z' fill='#ccc'/>");
        art.hats[1] = Item("Cowboy hat", "<path class='d' d='m16 1h-6v2h-2v4h-1v-1h-3v4h1v1h1v1h3v1h2v1h6v-1h4v-1h4v-1h3v-2h1v-3h-2v1h-1v-5h-2v-1h-6v1h-2z'/><path d='m16 2v1h1v-1zm0 1h-2v1h2zm-2 1h-1v1h1zm-7 3v2h1v-2zm1 2v1h1v-1zm1 1v1h1v-1zm1 1v2h1v-2zm1 2v1h6v-1zm6 0h1v-2h-1zm1-2h1v-1h-1zm1-1h5v-1h-5zm5-1h2v-1h-2zm2-1h1v-1h-1z' opacity='.1'/><path d='m9 8h-1v1h1v1h1v1h1v1h6v-1h1v-1h1v-1h-2v1h-5v-1h-2v-1z' opacity='.5'/>");
        art.hats[2] = Item("Tiara", "<path class='d' d='m17 1h-2v1h-2v1h-2v1h-1v1h-1v1h-1v2h-2v4h2v-2h1v-1h2v-1h3v1h3v-1h4v1h2v1h2v1h2v1h1v-3h-1v-2h-2v-2h-2v-1h-2v-1h-1v-1h-3z'/><path class='b' d='m17 3h-3v1h-1v3h1v1h3v-1h1v-3h-1z'/><path d='m14 3v1h1v-1zm1 1v1h1v-1zm1 0h1v-1h-1zm-1 1h-1v1h1zm-1 1h-1v1h1zm0-1v-1h-1v1z' fill='#fff' opacity='.3'/><path d='m14 2v1h3v-1zm3 1v3h-1v1h-3v1h1v1h3v-1h1v-1h1v-3h-1v-1zm-4 4v-3h-1v3zm0-3h1v-1h-1z' opacity='.1'/>");
        // ...

        art.neckwears[0] = Item("", "");
        // art.neckwears[1] = Item("Bitcoin", "...");
        // ...
    }

    function getCreatureMetadata(Witmons.Creature memory _creature)
        external view
        virtual override
        returns (string memory _json)
    {
        TraitIndexes memory _traits = _splitPhenotype(
            _creature.eggPhenotype,
            _creature.eggCategory,
            _creature.eggColorIndex
        );
        Item[5] memory _items = [
            art.species[_traits.species],
            art.backgrounds[_traits.background],
            art.eyewears[_traits.eyewear],
            art.hats[_traits.hat],
            art.neckwears[_traits.neckwear]
        ];
        string[5] memory _traitTypes = [
            "Species",
            "Background",
            "Eyewear",
            "Hat",
            "Neckwear"
        ];
        string memory _attributes;
        for (uint8 _i = 0; _i < _items.length; _i ++) {
            if (_items[_i].name != bytes12(0)) {
                _attributes = string(abi.encodePacked(
                    _attributes,
                    bytes(_attributes).length == 0 ? '{' : ', {',
                        '"trait_type": "', _traitTypes[_i], '",',
                        '"value": "', _items[_i].name, '"',
                    '}'
                ));
            }
        }
        return string(abi.encodePacked(
            '{',
                '"name": "Witty Creature #', _creature.tokenId.toString(), '",',
                '"description": "Witty Creatures 2.0 at Liscon 2021. Powered by Witnet!",',
                '"image_data": "', getCreatureImage(_creature), '",',
                '"external_url": "', baseURI, _creature.eggIndex.toString(), '",',
                '"attributes": [', _attributes, ']',
            '}'
        ));
    }

    function getCreatureImage(Witmons.Creature memory _creature)
        public view
        virtual override
        returns (string memory _svg)
    {
        TraitIndexes memory _traits = _splitPhenotype(
            _creature.eggPhenotype,
            _creature.eggCategory,
            _creature.eggColorIndex
        );
        return string(abi.encodePacked(
            "<svg width='32' height='32' version='1.1' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>",
                _styles(_creature.tokenId, _traits),
                "<rect width='32' height='32' class='a'/>",
                art.backgrounds[_traits.background].svg,
                art.species[_traits.species].svg,
                art.hats[_traits.hat].svg,
                art.eyewears[_traits.eyewear].svg,
            "</svg"
        ));
    }

    function _styles(uint256 _tokenId, TraitIndexes memory _traits)
        internal view
        returns (string memory)
    {
        return string(abi.encodePacked(
            "<style>#witmon", _tokenId.toString(), " .a { fill: #", art.colors[_traits.baseColor],
            "; } #witmon", _tokenId.toString(), " .b { fill: #", art.colors[_traits.eyesColor],
            "; } #witmon", _tokenId.toString(), " .c { fill: #", art.colors[_traits.eyewearColor],
            "; } #witmon", _tokenId.toString(), " .d { fill: #", art.colors[_traits.hatColor],
            "; }</style>"
        ));
    }

    function _splitPhenotype(
            bytes32 _eggPhenotype,
            Witmons.CreatureCategory _eggCategory,
            uint256 _eggColorIndex
        )
        internal view
        virtual
        returns (TraitIndexes memory _traits)
    {
        uint256 _seed; uint8 _numColors = uint8(art.colors.length);
        _traits.background = (_eggCategory == Witmons.CreatureCategory.Legendary
                ? 1 + randomUniform(_eggPhenotype, _seed ++, 13) // TODO: set total number of backgrounds
                : 0
            );
        _traits.baseColor = uint8(_eggColorIndex % _numColors);
        _traits.eyesColor = randomUniform(_eggPhenotype, _seed ++, _numColors);
        _traits.eyewear = randomUniformBase2(_eggPhenotype, _seed ++, 5); // TODO: set number of bits
        _traits.eyewearColor = randomUniform(_eggPhenotype, _seed ++, _numColors);
        _traits.hat = randomUniformBase2(_eggPhenotype, _seed ++, 5); // TODO: set number of bits
        _traits.hatColor = randomUniform(_eggPhenotype, _seed ++, _numColors);       
        _traits.neckwear = (_eggCategory != Witmons.CreatureCategory.Common
                ? 1 + randomUniform(_eggPhenotype, _seed ++, 11) // TODO: set total number of neckwears
                : 0
            );
        _traits.species = randomUniform(_eggPhenotype, _seed ++, 13); // TODO: set total number of species
    }
}
