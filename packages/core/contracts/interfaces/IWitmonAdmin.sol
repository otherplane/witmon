// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWitmonDecorator.sol";

interface IWitmonAdmin {
    /// Change batch parameters. Only possible while in 'Batching' status.
    /// @param _signator Externally-owned account authorize to sign egg's info before minting.
    /// @param _decorator Decorating logic contract producing a creature's metadata, and picture.
    /// @param _percentileMarks Creature-category ordered percentile marks (common first).
    /// @param _expirationBlocks Number of blocks after Witnet randomness is generated, 
    /// during which creatures may be minted.
    /// @param _totalEggs Maximum number of eggs that may eventually get minted.
    function setParameters(
        address _signator,
        IWitmonDecorator _decorator,
        uint8[] calldata _percentileMarks,
        uint256 _expirationBlocks,
        uint256 _totalEggs
    ) external;

    /// Stops batching, which means: (a) parameters cannot change anymore, and (b) a 
    /// random number will requested to the Witnet Decentralized Oracle Network.
    /// @dev While request is being attended, tender will remain in 'Randomizing' status.
    function stopBatching() external payable;

    /// Starts hatching, which means that minting of creatures will start to be possible,
    /// until the hatching period expires (see `_hatchingExpirationBlocks`).
    /// @dev During the hatching period the tender will remain in 'Hatching status'. Once the
    /// @dev hatching period expires, tender status will automatically change to 'Freezed'.
    function startHatching() external;
}

