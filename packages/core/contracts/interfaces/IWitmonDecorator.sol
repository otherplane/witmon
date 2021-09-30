// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/Witmons.sol";

interface IWitmonDecorator {
    function baseURI() external view returns (string memory);
    function getCreatureImage(Witmons.Creature memory) external view returns (string memory);
    function getCreatureMetadata(Witmons.Creature memory) external view returns (string memory);
}