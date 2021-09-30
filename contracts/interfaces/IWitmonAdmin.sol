// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWitmonDecorator.sol";

interface IWitmonAdmin {
    function newBatch(string calldata _name, string calldata _baseuri, IWitmonDecorator, uint256) external;
    function changeDecorator(string calldata, IWitmonDecorator) external;
    function layEggs(bytes32[] calldata) external;
    function eatEggs(bytes32[] calldata) external;
    function stopBatching() external;
    function startHatching() external;
}