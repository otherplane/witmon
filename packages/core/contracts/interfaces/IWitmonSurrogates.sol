// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWitmonSurrogates {
    function mintCreature(
        address _eggOwner,
        uint256 _eggIndex,
        uint256 _eggScore,
        uint256 _eggRanking,
        uint256 _totalClaimedEggs,
        bytes calldata _signature
    ) external;
    function previewCreatureImage(
        address _eggOwner,
        uint256 _eggIndex,
        uint256 _eggScore,
        uint256 _eggRanking,
        uint256 _totalClaimedEggs,
        bytes calldata _signature
    ) external view returns (string memory);
}
