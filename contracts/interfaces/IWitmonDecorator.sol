// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/Witmons.sol";

interface IWitmonDecorator {
    function metadata(bytes32, Witmons.Creature memory) external view returns (string memory);
    function picture(bytes32, Witmons.Creature memory) external view returns (string memory);
}