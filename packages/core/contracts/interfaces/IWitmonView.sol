// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libs/Witmons.sol";

interface IWitmonView {
    function getCreatureData(uint256 _eggIndex) external view returns (Witmons.Creature memory);
    function getCreatureImage(uint256 _eggIndex) external view returns (string memory);
    function getCreatureStatus(uint256 _eggIndex) external view returns (Witmons.CreatureStatus);  
    function getParameters() external view returns (Witmons.Parameters memory);
    function getStats() external view returns (uint256 _totalEggs, uint256 _totalSupply);
    function getStatus() external view returns (Witmons.Status);
    // function previewCreatureImage(/*...*/) external view returns (string memory);
}