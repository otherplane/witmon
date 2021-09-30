// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWitmonDecorator.sol";

interface IWitmonEvents {
    event BatchParameters(
        address signator,
        IWitmonDecorator decorator,
        uint8[] percentileMarks,
        uint256 expirationBlocks,
        uint256 totalEggs
    );
    event WitnetResult(bytes32 randomness);
    event WitnetError(string reason);
    event NewCreature(uint256 eggIndex, uint256 tokenId);
}
