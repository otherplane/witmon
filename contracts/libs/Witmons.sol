// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

library Witmons {

    enum Status {
        Freezed,
        Batching,
        Randomizing,
        Hatching
    }

    struct State {
        Counters.Counter tokenIds;

        uint256 lastBatch;
        uint256 totalBatches;
        uint256 totalHatches;
        uint256 totalEggs;        
        
        bytes32[] genotypes;

        mapping (/* genotype => Creature */ bytes32 => Creature) creatures;
        mapping (/* tokenId  => genotype */ uint256 => bytes32) tokenGenotypes;       
        mapping (/* batchId  => Batch    */ uint256 => Batch) batches;
    }

    struct Batch {
        string  baseURI;
        string  batchName;
        bytes32 batchSeed;

        uint256 hatchingExpirationBlocks;
        uint256 previousBatch;        
        
        uint256 totalEggs;
        uint256 totalHatches;        

        uint256 witnetQueryId;
        bytes32 witnetRandomness;
        uint256 hatchingBlock;

        address decorator;
    }

    enum CreatureStatus {
        Inexistent,
        Incubating,
        Hatching,
        Alive,
        Freezed
    }

    struct Creature {
        uint256 index;
        uint256 batchId;
        uint256 inception;
        uint256 tokenId;        
        uint256 eggscore;
        uint256 ranking;
        bytes32 phenotype;
    }


    /// Gets tender's current status.
    function status(State storage self)
        internal view
        returns (Status)
    {
        uint _batchId = self.lastBatch;
        Batch storage _batch = self.batches[_batchId];

        if (_batch.witnetRandomness != bytes32(0)) {
            return (block.number > _batch.hatchingBlock + _batch.hatchingExpirationBlocks)
                ? Status.Freezed
                : Status.Hatching;
        } else if (_batch.witnetQueryId > 0) {
            return Status.Randomizing;
        } else {
            return (_batchId > 0) ? Status.Batching : Status.Freezed;
        }
    }

    /// @dev Produces revert message when tender is not in expected status.
    function statusRevertMessage(Status _status)
        internal pure
        returns (string memory)
    {
        if (_status == Status.Freezed) {
            return "Witmons: not in Freezed status";
        } else if (_status == Status.Batching) {
            return "Witmons: not in Batching status";
        } else if (_status == Status.Randomizing) {
            return "Witmons: not in Randomizing status";
        } else if (_status == Status.Hatching) {
            return "Witmons: not in Hatching status";
        } else {
            return "Witmons: bad mood";
        }
    }

}
