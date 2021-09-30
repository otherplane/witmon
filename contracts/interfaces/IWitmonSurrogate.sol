// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWitmonSurrogate {
    function mintCreature(bytes32, bytes32, uint256, uint256/*, ...*/) external;
}