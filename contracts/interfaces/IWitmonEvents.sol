// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWitmonEvents {
    event NewBatch(uint256 indexed id, string name, string baseURI, uint256 hatchingExpirationBlocks);
    event NewGenotype(bytes32 indexed genotype, uint256 index);
    event EggLaid(uint256 indexed batchId, bytes32 indexed genotype, bytes32 batchSeed);
    event EggEaten(uint256 indexed batchId, bytes32 indexed genotype, bytes32 batchSeed);    
    event WitnetResult(uint256 indexed batchId, bytes32 randomness);
    event WitnetError(uint256 indexed batchId, string reason); 
    event NewCreature(uint256 indexed batchId, bytes32 indexed genotype, uint256 tokenId);
    event DecoratorChanged(uint256 indexed batchId, string baseURI, address indexed decorator);
}
