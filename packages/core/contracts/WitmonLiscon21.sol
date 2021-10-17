// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./WitmonDecoratorBase.sol";

contract WitmonLiscon21
    is
        Ownable,
        WitmonDecoratorBase
{
    using Strings for uint256;
    using Witmons for bytes32;
   
    struct TraitIndexes {
        uint8 baseColor;
        uint8 background;
        uint8 eyesColor;
        uint8 eyewear;
        uint8 eyewearColor;
        uint8 hat;
        uint8 hatColor;
        uint8 species;
    }

    struct TraitRanges {
        uint8 species;
        uint8 backgrounds;
        uint8 eyewears;
        uint8 hats;
    }

    struct Art {
        string[] colors;
        mapping(uint256 => Item) species;
        mapping(uint256 => Item) backgrounds;
        mapping(uint256 => Item) eyewears;
        mapping(uint256 => Item) hats;
    }

    struct Item {
        string name;
        string svg;
    }

    Art internal art;
    bool public forged;
    TraitRanges internal ranges;
    address internal immutable deployer;

    modifier notForged {
        require(!forged, "WitmonLiscon21: already forged");
        _;
    }

    modifier isForged {
        require(forged, "WitmonLiscon21: not forged");
        _;
    }

    constructor(string memory _baseURI)
        WitmonDecoratorBase(_baseURI)
    {
        art.colors = [
            "080", 
            "333",
            "f00",
            "627", 
            "eee", 
            "fd2",
            "00d"
        ];
        deployer = msg.sender;
    }

    function forge()
        external virtual
        notForged
        onlyOwner
    {
        require(ranges.backgrounds > 0, "WitmonLiscon21: no backgrounds");
        require(ranges.eyewears > 0, "WitmonLiscon21: no eyewears");
        require(ranges.hats > 0, "WitmonLiscon21: no hats");
        require(ranges.species > 0, "WitmonLiscon21: no species");
        forged = true;
    }

    function getArtBackgrounds()
        external virtual view
        returns (Item[] memory _items)
    {
        _items = new Item[](ranges.backgrounds);
        for (uint _i = 0; _i < ranges.backgrounds; _i ++) {
            _items[_i] = art.backgrounds[_i];
        }
    }

    function getArtColors()
        external virtual view
        returns (string[] memory)
    {
        return art.colors;
    }

    function getArtEyewears()
        external virtual view
        returns (Item[] memory _items)
    {
        _items = new Item[](ranges.eyewears);
        for (uint _i = 0; _i < ranges.eyewears; _i ++) {
            _items[_i] = art.eyewears[_i];
        }
    }

    function getArtHats()
        external virtual view
        returns (Item[] memory _items)
    {
        _items = new Item[](ranges.hats);
        for (uint _i = 0; _i < ranges.hats; _i ++) {
            _items[_i] = art.hats[_i];
        }
    }

    function getArtSpecies()
        external virtual view
        returns (Item[] memory _species)
    {
        _species = new Item[](ranges.species);
        for (uint _i = 0; _i < ranges.species; _i ++) {
            _species[_i] = art.species[_i];
        }
    }

    function getCreatureMetadata(Witmons.Creature memory _creature)
        external view
        virtual override
        isForged
        returns (string memory _json)
    {
        TraitIndexes memory _traits = _splitPhenotype(
            _creature.eggIndex,
            _creature.eggPhenotype,
            _creature.eggCategory
        );
        Item[4] memory _items = [
            art.species[_traits.species],
            art.backgrounds[_traits.background],
            art.eyewears[_traits.eyewear],
            art.hats[_traits.hat]
        ];
        string[4] memory _traitTypes = [
            "Species",
            "Background",
            "Eyewear",
            "Hat"
        ];
        string memory _attributes;
        for (uint8 _i = 0; _i < _items.length; _i ++) {
            if (bytes(_items[_i].name).length > 0) {
                _attributes = string(abi.encodePacked(
                    _attributes,
                    bytes(_attributes).length == 0 ? "{" : ", {",
                        "\"trait_type\": \"", _traitTypes[_i], "\",",
                        "\"value\": \"", _items[_i].name, "\"",
                    "}"
                ));
            }
        }
        // add egg's score, birthday and ranking as trait_types in the attributes part
        _attributes = string(abi.encodePacked(
            _attributes,
            ", { \"trait_type\": \"EggScore\",\"value\": ", 
                _creature.eggScore.toString(),
            " }, { \"display_type\": \"number\",\"trait_type\": \"Ranking\",\"value\": ",
                _creature.eggRanking.toString(),
            " }, { \"display_type\": \"date\",\"trait_type\": \"birthday\",\"value\": ",
                _creature.eggBirth.toString(),
            " }"
        ));
        return string(abi.encodePacked(
            "{",
                "\"name\": \"Witty Creature #", _creature.tokenId.toString(), "\",",
                "\"description\": \"Witty Creatures LisCon 2021 Special Edition.\",",
                "\"image_data\": \"", getCreatureImage(_creature), "\",",
                "\"external_url\": \"", baseURI, _creature.tokenId.toString(), "\",",
                "\"attributes\": [", _attributes, "]",
            "}"
        ));
    }

    function getCreatureImage(Witmons.Creature memory _creature)
        public view
        virtual override
        isForged
        returns (string memory _svg)
    {
        TraitIndexes memory _traits = _splitPhenotype(
            _creature.eggIndex,
            _creature.eggPhenotype,
            _creature.eggCategory
        );
        return string(abi.encodePacked(
            "<svg version='1.1' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>",
                _styles(_traits),
                "<rect width='32' height='32' class='a'/>",
                art.backgrounds[_traits.background].svg,
                art.species[_traits.species].svg,
                art.eyewears[_traits.eyewear].svg,
                art.hats[_traits.hat].svg,                
            "</svg>"
        ));
    }

    function pushArtBackground(Item calldata _item)
        external virtual
        notForged
        onlyOwner
    {
        art.backgrounds[ranges.backgrounds ++] = _item;
    }

    function pushArtEyewear(Item calldata _item)
        external virtual
        notForged
        onlyOwner
    {
        art.eyewears[ranges.eyewears ++] = _item;
    }

    function pushArtHat(Item calldata _item)
        external virtual
        notForged
        onlyOwner
    {
        art.hats[ranges.hats ++] = _item;
    }

    function pushArtSpecies(Item calldata _item)
        external virtual
        notForged
        onlyOwner
    {
        art.species[ranges.species ++] = _item;
    }

    function setArtBackground(uint8 _index, Item calldata _item)
        external virtual
        // notForged
        onlyOwner
    {
        require(_index < ranges.backgrounds, "WitmonLiscon21: out of bounds");
        art.backgrounds[_index] = _item;
    }

    function setArtColor(uint8 _index, string calldata _colorHex)
        external virtual
        // notForged
        onlyOwner
    {
        require(_index < art.colors.length, "WitmonLiscon21: out of bounds");
        art.colors[_index] = _colorHex;
    }

    function setArtEyewear(uint8 _index, Item calldata _item)
        external virtual
        // notForged
        onlyOwner
    {
        require(_index < ranges.eyewears, "WitmonLiscon21: out of bounds");
        art.eyewears[_index] = _item;
    }

    function setArtHat(uint8 _index, Item calldata _item)
        external virtual
        // notForged
        onlyOwner
    {
        require(_index < ranges.hats, "WitmonLiscon21: out of bounds");
        art.hats[_index] = _item;
    }

    function setArtSpecies(uint8 _index, Item calldata _item)
        external virtual
        // notForged
        onlyOwner
    {
        require(_index < ranges.species, "WitmonLiscon21: out of bounds");
        art.species[_index] = _item;
    }

    function _styles(TraitIndexes memory _traits)
        internal view
        returns (string memory)
    {
        return string(abi.encodePacked(
            "<style> .a { fill: #", art.colors[_traits.baseColor],
            "; } .b { fill: #", art.colors[_traits.eyesColor],
            "; } .c { fill: #", art.colors[_traits.eyewearColor],
            "; } .d { fill: #", art.colors[_traits.hatColor],
            "; }</style>"
        ));
    }

    function _splitPhenotype(
            uint256 _eggIndex,
            bytes32 _eggPhenotype,
            Witmons.CreatureCategory _eggCategory
        )
        internal view
        virtual
        returns (TraitIndexes memory _traits)
    {
        uint _seed; uint8 _numColors = uint8(art.colors.length);

        _traits.baseColor = uint8(_eggIndex % _numColors);
        _traits.eyesColor = _eggPhenotype.randomUint8(_seed ++, _numColors);
        _traits.species = _eggPhenotype.randomUint8(_seed ++, ranges.species);

        _traits.background = (_eggCategory == Witmons.CreatureCategory.Legendary
                ? 1 + _eggPhenotype.randomUint8(_seed ++, ranges.backgrounds - 1)
                : 0
            );

        _traits.eyewear = (_eggCategory != Witmons.CreatureCategory.Common
                ? 1 + _eggPhenotype.randomUint8(_seed ++, (ranges.eyewears * 2) / 3)
                : 0
            );
        _traits.eyewearColor = _eggPhenotype.randomUint8(_seed ++, _numColors);

        _traits.hat = _eggPhenotype.randomUint8(_seed ++, (ranges.hats * 2) / 3);
        _traits.hatColor = _eggPhenotype.randomUint8(_seed ++, _numColors);
    }
}
