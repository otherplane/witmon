// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "witnet-solidity-bridge/contracts/interfaces/IWitnetRequest.sol";
import "../interfaces/IWitmonDecorator.sol";

library Witmons {

    struct State {
        Parameters params;
        IWitmonDecorator decorator;
        IWitnetRequest witnetRNG;
        uint256 witnetQueryId;
        bytes32 witnetRandomness;
        uint256 hatchingBlock;        
        Counters.Counter totalSupply;
        mapping (/* eggIndex => Creature */ uint256 => Creature) creatures;
        mapping (/* tokenId  => eggIndex */ uint256 => uint256) eggIndex_;
    }

    struct Parameters {
        address signator;
        uint8[] percentileMarks;      
        uint256 expirationBlocks;
    }

    enum Status {
        Batching,
        Randomizing,
        Hatching,
        Freezed
    }

    struct Creature {
        uint256 tokenId;   
        uint256 eggBirth;
        uint256 eggIndex;
        uint256 eggColorIndex;
        uint256 eggScore;
        uint256 eggRanking;
        bytes32 eggPhenotype;
        CreatureCategory eggCategory;
    }

    enum CreatureCategory {
        Legendary,  // 0
        Rare,       // 1
        Common      // 2
    }

    enum CreatureStatus {
        Inexistent, // 0
        Incubating, // 1
        Hatching,   // 2
        Alive,      // 3
        Freezed     // 4
    }

    /// Recovers address from hash and signature.
    function recoverAddr(bytes32 _hash, bytes memory _signature)
        internal pure
        returns (address)
    {
        if (_signature.length != 65) {
            return (address(0));
        }
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return address(0);
        }
        if (v != 27 && v != 28) {
            return address(0);
        }
        return ecrecover(_hash, v, r, s);
    }

    /// Calculate creature category.
    function creatureCategory(State storage _self, uint8 _percentile100)  
        internal view
        returns (CreatureCategory)
    {
        uint8 _i; uint8 _cumuled;
        for (; _i < _self.params.percentileMarks.length; _i ++) {
            _cumuled += _self.params.percentileMarks[_i];
            if (_percentile100 <= _cumuled) {
                break;
            }
        }
        return CreatureCategory(_i);
    }

    /// Gets tender's current status.
    function status(State storage self)
        internal view
        returns (Status)
    {
        if (self.witnetRandomness != bytes32(0)) {
            return (block.number > self.hatchingBlock + self.params.expirationBlocks)
                ? Status.Freezed
                : Status.Hatching;
        } else if (self.witnetQueryId > 0) {
            return Status.Randomizing;
        } else {
            return Status.Batching;
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
