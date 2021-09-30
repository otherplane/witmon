// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "witnet-ethereum-bridge/contracts/UsingWitnet.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IWitmonAdmin.sol";
import "./interfaces/IWitmonEvents.sol";
import "./interfaces/IWitmonSurrogate.sol";
import "./interfaces/IWitmonView.sol";

contract WitmonERC721
    is
        ERC721
        , Ownable
        , ReentrancyGuard
		, UsingWitnet
		, IWitmonAdmin
		, IWitmonEvents
		, IWitmonSurrogate
		, IWitmonView
{
  	using Counters for Counters.Counter;
  	using Strings for bytes32;
	using Witmons for Witmons.State;

	Witmons.State internal _state;

	modifier inStatus(Witmons.Status _status) {
		require(
			_state.status() == _status,
			Witmons.statusRevertMessage(_status)
		);
		_;
	}

	modifier tokenExists(uint256 _tokenId) {
		require(
			_exists(_tokenId),
			"WitnetERC721: inexistent token"
		);
		_;
	}

  	constructor(WitnetRequestBoard _witnet)
        ERC721("Witty Creatures NFTs", "WITMON")
		UsingWitnet(_witnet)
	{
		_state.genotypes.push(bytes32(0));
	}


	// ========================================================================
	// --- 'ERC721' overriden functions ---------------------------------------

	function metadata(uint256 _tokenId)
		external
		virtual view
		tokenExists(_tokenId)
		returns (string memory)
	{
		bytes32 _genotype = _state.tokenGenotypes[_tokenId];
		Witmons.Creature memory _creature = _state.creatures[_genotype];
		Witmons.Batch storage _batch = _state.batches[_creature.batchId];
		address _decorator = _batch.decorator;
		return (_decorator != address(0)) 
			? IWitmonDecorator(_decorator).metadata(_genotype, _creature)
			: ''
		;
	}

	function tokenURI(uint256 _tokenId)
		public view
		virtual override
		tokenExists(_tokenId)
		returns (string memory)
	{
		bytes32 _tokenGenotype = _state.tokenGenotypes[_tokenId];
		uint256 _tokenBatchId = _state.creatures[_tokenGenotype].batchId;
		string memory _uribase = _state.batches[_tokenBatchId].baseURI;
		return bytes(_uribase).length > 0
			? string(abi.encodePacked(
					_uribase,
					'' // TODO: _tokenGenotype.toString()			
				))
			: ''
		;
	}


	// ========================================================================
	// --- Implementation of 'IWitmonAdmin' -----------------------------------

	function newBatch(
			string calldata _name,
			string calldata _uribase,
			IWitmonDecorator _decorator,
			uint256 _hatchingExpirationBlocks
		)
		external
		virtual override
		onlyOwner
		inStatus(Witmons.Status.Freezed)
	{
		require(bytes(_uribase).length > 0, "WitmonERC721: empty URI");
		require(address(_decorator) != address(0), "WitmonERC721: no decorator");
		Witmons.Batch storage _batch = _state.batches[block.number];
		_batch.baseURI = _uribase;
		_batch.batchName = _name;
		_batch.decorator = address(_decorator);
		_batch.hatchingExpirationBlocks = _hatchingExpirationBlocks;
		_batch.previousBatch = _state.lastBatch;
		_state.totalBatches ++;
		_state.lastBatch = block.number;		
		emit NewBatch(block.number, _name, _uribase, _hatchingExpirationBlocks);
	}

	function changeDecorator(
			string calldata _uribase,
			IWitmonDecorator _decorator
		)
		external
		virtual override 
		onlyOwner
		inStatus(Witmons.Status.Batching)
	{
		(uint256 _batchId, Witmons.Batch storage _batch) = _getLastBatch();
		if (bytes(_uribase).length > 0) {
			_batch.baseURI = _uribase;
		}
		if (address(_decorator) != address(0)) {
			_batch.decorator = address(_decorator);
		}		
		emit DecoratorChanged(_batchId, _uribase, address(_batch.decorator));
	}

	function layEggs(bytes32[] calldata _genotypes)
		external
		virtual override
		onlyOwner
		inStatus(Witmons.Status.Batching)
	{
		(uint256 _batchId, Witmons.Batch storage _batch) = _getLastBatch();
		uint256 _newEggs;		
		bytes32 _batchSeed = _batch.batchSeed;
		for (uint _i = 0; _i < _genotypes.length; _i ++) {
			bytes32 _genotype = _genotypes[_i];
			Witmons.Creature storage _creature = _state.creatures[_genotype];
			if (_creature.index == 0) {
				// create genotype entry if totally new
				uint _index = _state.genotypes.length;
				_creature.index = _index;
				_state.genotypes.push(_genotype);
				emit NewGenotype(_genotype, _index);
			}
			if (_creature.batchId == 0) {				
				// if no batch id assigned, it could have been deleted, so assign current batch	
				_creature.batchId = _batchId;
				_batchSeed ^= _genotype;
				_newEggs ++;
				emit EggLaid(_batchId, _genotype, _batchSeed);
			}
		}
		_batch.batchSeed = _batchSeed;
		_batch.totalEggs += _newEggs;
		_state.totalEggs += _newEggs;
	}

	function eatEggs(bytes32[] calldata _genotypes)
		external
		virtual override
		onlyOwner
		inStatus(Witmons.Status.Batching)
	{
		(uint256 _batchId, Witmons.Batch storage _batch) = _getLastBatch();
		uint256 _eatenEggs;
		uint256 _batchEggs = _batch.totalEggs;
		uint256 _stateEggs = _state.totalEggs;
		bytes32 _batchSeed = _batch.batchSeed;
		for (uint _i = 0; _i < _genotypes.length; _i ++) {
			bytes32 _genotype = _genotypes[_i];
			Witmons.Creature storage _creature = _state.creatures[_genotype];
			if (_creature.index > 0 && _creature.batchId == _batchId) {
				_creature.batchId = 0;
				_batchSeed ^= _genotype;
				_eatenEggs ++;
				emit EggEaten(_batchId, _genotype,_batchSeed);
			}
		}
		_batch.batchSeed = _batchSeed;
		_batch.totalEggs = _batchEggs > _eatenEggs ? (_batchEggs - _eatenEggs) : 0;
		_state.totalEggs = _stateEggs > _eatenEggs ? (_stateEggs - _eatenEggs) : 0;
	}

	function stopBatching()
		external
		virtual override
		onlyOwner
		inStatus(Witmons.Status.Batching)
	{
		// TODO
	}

	function startHatching()
		external
		virtual override
		onlyOwner
		inStatus(Witmons.Status.Randomizing)
	{
		(uint256 _batchId, Witmons.Batch storage _batch) = _getLastBatch();
		uint _queryId = _batch.witnetQueryId;
		require(
			_witnetCheckResultAvailability(_queryId),
			"WitmonsERC721: randomness not yet solved"
		);
		Witnet.Result memory _result = witnet.readResponseResult(_queryId);
		if (witnet.isOk(_result)) {
			bytes32 _randomness = _bytesToBytes32(witnet.asBytes(_result));
			emit WitnetResult(_batchId, _randomness);
			_batch.witnetRandomness = _randomness;
			_batch.hatchingBlock = block.number;
			
		} else {
			string memory _errorMessage;
            // Try to read the value as an error message, catch error bytes if read fails
            try witnet.asErrorMessage(_result)
				returns (Witnet.ErrorCodes, string memory e)
			{
                _errorMessage = e;
            }
            catch (bytes memory _errorBytes) {
                _errorMessage = string(_errorBytes);
            }
            emit WitnetError(_batchId, _errorMessage);
			_batch.witnetQueryId = 0;
		}
	}	


	// ========================================================================
	// --- Implementation of 'IWitmonSurrogate' -------------------------------

	function mintCreature(
			bytes32 _batchSeed,
			bytes32 _genotype,			
			uint256 _eggscore,
			uint256 _ranking
			//, ...
		)
		external
		virtual override
		inStatus(Witmons.Status.Hatching)
	{
		// TODO: verify signer

		(uint256 _batchId, Witmons.Batch storage _batch) = _getLastBatch();
		Witmons.Creature storage _creature = _state.creatures[_genotype];

		require(_batchSeed == _batch.batchSeed, "WitmonsERC721: bad seed");
		require(_batchId == _creature.batchId, "WitmonsERC721: bad genotype");
		require(_creature.tokenId == 0, "WitmonsERC721: already minted");

		_state.tokenIds.increment();
		uint256 _tokenId = _state.tokenIds.current();

		_creature.inception = block.number;
		_creature.tokenId = _tokenId;
		_creature.eggscore = _eggscore;
		_creature.ranking  = _ranking;
		_creature.phenotype = keccak256(abi.encodePacked(
			_batchSeed,
			_genotype,
			_batch.witnetRandomness
		));
		
		_state.tokenGenotypes[_tokenId] = _genotype;
		_state.totalHatches ++;
		_batch.totalHatches ++;

		_safeMint(msg.sender, _tokenId);
		emit NewCreature(_batchId, _genotype, _tokenId);
	}


	// ========================================================================
	// --- Implementation of 'IWitmonView' ------------------------------------

	function getBatchData(uint256 _batchId)
		external view override
		returns (Witmons.Batch memory)
	{
		return _state.batches[_batchId];
	}

	function getCreatureData(bytes32 _genotype)
		public view
		override
		returns (Witmons.Creature memory)
	{
		return _state.creatures[_genotype];
	}

	function getCreatureStatus(bytes32 _genotype)
		public view
		virtual override
		returns (Witmons.CreatureStatus)
	{
		Witmons.Creature storage _creature = _state.creatures[_genotype];
		if (_creature.index == 0) {
			return Witmons.CreatureStatus.Inexistent;
		} else if (_creature.phenotype != bytes32(0)) {
			return Witmons.CreatureStatus.Alive;
		} else {
			if (_creature.batchId != _state.lastBatch) {
				return Witmons.CreatureStatus.Freezed;
			}
			Witmons.Status _tenderStatus = _state.status();
			if (_tenderStatus == Witmons.Status.Hatching) {
				return Witmons.CreatureStatus.Hatching;
			} else {
				return Witmons.CreatureStatus.Incubating;
			}
		}
	}

	function getGenotypes()
		external view
		override
		returns (bytes32[] memory)
	{
		return _state.genotypes;
	}

	function getLastBatch()
		external view
		override
		returns (uint256)
	{
		return _state.lastBatch;
	}

	function getStats()
		public view
		override
		returns (
			uint256 _totalSuppy,
			uint256 _totalBatches,
			uint256 _totalEggs,
			uint256 _totalHatches,
			uint256 _totalGenotypes
		)
	{
		return (
			_state.tokenIds.current(),
			_state.totalBatches,
			_state.totalEggs,
			_state.totalHatches,
			_state.genotypes.length
		);
	}

	function getStatus()
		public view
		override
		returns (Witmons.Status)
	{
		return _state.status();
	}

	function getTokenGenotype(uint256 _tokenId)
		public view
		override
		tokenExists(_tokenId)
		returns (bytes32)
	{
		return _state.tokenGenotypes[_tokenId];
	}

	function getTokenPicture(uint256 _tokenId)
		external view
		override
		returns (string memory)
	{
		bytes32 _genotype = getTokenGenotype(_tokenId);
		Witmons.Creature memory _creature = _state.creatures[_genotype];
		Witmons.Batch storage _batch = _state.batches[_creature.batchId];
		address _decorator = _batch.decorator;
		return (_decorator != address(0))
			? IWitmonDecorator(_decorator).picture(_genotype, _creature)
			: ''
		;
	}


	// ------------------------------------------------------------------------
	// --- INTERNAL METHODS ---------------------------------------------------
	// ------------------------------------------------------------------------

	function _getLastBatch()
		internal view
		returns (
			uint256 _batchId,
			Witmons.Batch storage _batch
		)
	{
		_batchId = _state.lastBatch;
		_batch = _state.batches[_batchId];
	}


	// ------------------------------------------------------------------------
	// --- PRIVATE METHODS ----------------------------------------------------
	// ------------------------------------------------------------------------

	function _bytesToBytes32(bytes memory _bb)
		private pure
		returns (bytes32 _r)
	{
		uint _len = _bb.length > 32 ? 32 : _bb.length;
		for (uint _i = 0; _i < _len; _i ++) {
			_r |= bytes32(_bb[_i] & 0xff) >> (_i * 8);
		}
	}
}
