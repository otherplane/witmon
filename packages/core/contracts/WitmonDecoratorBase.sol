// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IWitmonDecorator.sol";

abstract contract WitmonDecoratorBase
    is
        IWitmonDecorator
{
    string public override baseURI;

    constructor(string memory _baseURI) {
        bytes memory _rawURI = bytes(_baseURI);
        require(
            _rawURI.length > 0,
            "WitmonDecoratorBase: empty URI"
        );
        require(
            _rawURI[_rawURI.length - 1] == "/",
            "WitmonDecoratorBase: no trailing slash"
        );
        baseURI = _baseURI;
    }

    /// @dev ...
    function randomUniform(bytes32 _phenotype, uint256 _seed, uint8 _range)
        public pure
        virtual
        returns (uint8 _number)
    {
        bytes32 _hash = keccak256(abi.encode(_phenotype, _seed));
        do {
            _number = uint8(uint256(keccak256(abi.encode(_hash))));
        } while (_number >= _range);
    }

    /// @dev ...
    function randomUniformBase2(bytes32 _phenotype, uint256 _seed, uint8 _bits)
        public pure
        virtual
        returns (uint8 _number)
    {
        assert(_bits <= 8);
        uint8 _mask = uint8(uint256(2 ** _bits) - 1);
        return uint8(uint256(keccak256(abi.encode(_phenotype, _seed)))) & _mask;
    }	
}
