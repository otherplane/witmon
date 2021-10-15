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

    modifier onlyDeployer {
        require(msg.sender == deployer, "WitmonLiscon21: only deployer");
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
            "ebebf7",
            "1c1d2f", 
            "cc0d3d",
            "d22f94",
            "890ec1", 
            "1c49d8",
            "19b554"
        ];
        deployer = msg.sender;
    }

    function forge()
        external virtual
        notForged
        onlyDeployer
    {
        require(ranges.backgrounds > 0, "WitmonLiscon21: no backgrounds");
        require(ranges.eyewears > 0, "WitmonLiscon21: no eyewears");
        require(ranges.hats > 0, "WitmonLiscon21: no hats");
        require(ranges.species > 0, "WitmonLiscon21: no species");
        forged = true;
    }

    function getArtBackgrounds()
        external virtual
        returns (Item[] memory _items)
    {
        _items = new Item[](ranges.backgrounds);
        for (uint _i = 0; _i < ranges.backgrounds; _i ++) {
            _items[_i] = art.backgrounds[_i];
        }
    }

    function getArtEyewears()
        external virtual
        returns (Item[] memory _items)
    {
        _items = new Item[](ranges.eyewears);
        for (uint _i = 0; _i < ranges.eyewears; _i ++) {
            _items[_i] = art.eyewears[_i];
        }
    }

    function getArtHats()
        external virtual
        returns (Item[] memory _items)
    {
        _items = new Item[](ranges.hats);
        for (uint _i = 0; _i < ranges.hats; _i ++) {
            _items[_i] = art.hats[_i];
        }
    }

    function getArtSpecies()
        external virtual
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
        // add egg's score and ranking as trait_types in the attributes part
        _attributes = string(abi.encodePacked(
            _attributes,
            ", { \"trait_type\": \"Score\",\"value\": ", 
                _creature.eggScore.toString(),
            " }, { \"trait_type\": \"Ranking\",\"value\": \"#",
                _creature.eggRanking.toString(),
            "\" }"
        ));
        return string(abi.encodePacked(
            "{",
                "\"name\": \"Witty Creature #", _creature.tokenId.toString(), "\",",
                "\"description\": \"Witty Creatures 2.0 at Liscon 2021. Powered by Witnet!\",",
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
            "<svg width='32' height='32' version='1.1' viewBox='0 0 32 32' xmlns:xlink='http://www.w3.org/1999/xlink'>",
                _styles(_creature.eggIndex, _traits),
                "<rect width='32' height='32' class='a'/>",
                art.backgrounds[_traits.background].svg,
                art.species[_traits.species].svg,
                art.hats[_traits.hat].svg,
                art.eyewears[_traits.eyewear].svg,
            "</svg>"
        ));
    }

    function setArtBackgrounds(Item[] calldata _items)
        external virtual
        notForged
        onlyDeployer
    {
        require(_items.length > 0 && _items.length < 256, "WitmonERC721: no backgrounds");
        ranges.backgrounds = uint8(_items.length);
        for (uint _i = 0; _i < _items.length; _i ++) {
            art.backgrounds[_i] = _items[_i];
        }
    }

    function setArtEyewears(Item[] calldata _items)
        external virtual
        notForged
        onlyDeployer
    {
        require(_items.length > 0 && _items.length < 256, "WitmonERC721: no eyewears");
        ranges.eyewears = uint8(_items.length);
        for (uint _i = 0; _i < _items.length; _i ++) {
            art.eyewears[_i] = _items[_i];
        }
    }

    function setArtHats(Item[] calldata _items)
        external virtual
        notForged
        onlyDeployer
    {
        require(_items.length > 0 && _items.length < 256, "WitmonERC721: no hats");
        ranges.hats = uint8(_items.length);
        for (uint _i = 0; _i < _items.length; _i ++) {
            art.hats[_i] = _items[_i];
        }
    }
   
    function setArtSpecies(Item[] calldata _items)
        external virtual
        notForged
        onlyDeployer
    {
        require(_items.length > 0 && _items.length < 256, "WitmonERC721: no species");
        ranges.species = uint8(_items.length);
        for (uint _i = 0; _i < _items.length; _i ++) {
            art.species[_i] = _items[_i];
        }
    }

    function _styles(uint256 _creatureId, TraitIndexes memory _traits)
        internal view
        returns (string memory)
    {
        return string(abi.encodePacked(
            "<style>#witmon", _creatureId.toString(), " .a { fill: #", art.colors[_traits.baseColor],
            "; } #witmon", _creatureId.toString(), " .b { fill: #", art.colors[_traits.eyesColor],
            "; } #witmon", _creatureId.toString(), " .c { fill: #", art.colors[_traits.eyewearColor],
            "; } #witmon", _creatureId.toString(), " .d { fill: #", art.colors[_traits.hatColor],
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
        uint256 _seed; uint8 _numColors = uint8(art.colors.length);
        _traits.background = (_eggCategory == Witmons.CreatureCategory.Legendary
                ? 1 + randomUniform(_eggPhenotype, _seed ++, ranges.backgrounds - 1)
                : 0
            );
        _traits.baseColor = uint8(_eggIndex % _numColors);
        _traits.eyesColor = randomUniform(_eggPhenotype, _seed ++, _numColors);
        _traits.eyewear = (_eggCategory != Witmons.CreatureCategory.Common
                ? 1 + randomUniform(_eggPhenotype, _seed ++, ranges.eyewears - 1)
                : 0
            );
        _traits.eyewearColor = randomUniform(_eggPhenotype, _seed ++, _numColors);
        _traits.hat = randomUniformBase2(_eggPhenotype, _seed ++, 5); // TODO: set number of bits
        _traits.hatColor = randomUniform(_eggPhenotype, _seed ++, _numColors);       
        _traits.species = randomUniform(_eggPhenotype, _seed ++, ranges.species);
    }
}
