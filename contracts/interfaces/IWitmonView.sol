// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/Witmons.sol";

interface IWitmonView {
    function getBatchData(uint256) external view returns (Witmons.Batch memory);
    function getCreatureData(bytes32) external view returns (Witmons.Creature memory);
    function getCreatureStatus(bytes32) external view returns (Witmons.CreatureStatus);
    function getGenotypes() external view returns (bytes32[] memory);
    function getLastBatch() external view returns (uint256);
    function getStats() external view returns (uint256, uint256, uint256, uint256, uint256);
    function getStatus() external view returns (Witmons.Status);
    function getTokenGenotype(uint256 _tokenId) external view returns (bytes32);
    function getTokenPicture(uint256 _tokenId) external view returns (string memory);
}