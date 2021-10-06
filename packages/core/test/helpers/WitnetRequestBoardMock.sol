// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "witnet-solidity-bridge/contracts/interfaces/IWitnetRequest.sol";
import "witnet-solidity-bridge/contracts/libs/Witnet.sol";

contract WitnetRequestBoardMock {
    uint256 queryId;
    function estimateReward(uint256)
        public pure
        returns (uint256)
    {
        return 10 ** 10; // 10 gwei
    }

    function postRequest(IWitnetRequest)
        public payable
        returns (uint256)
    {
        return ++ queryId;
    }

    function deleteQuery(uint256)
        external view
        returns (Witnet.Response memory _response)
    {
        return Witnet.Response({
            reporter: address(this),
            timestamp: block.timestamp,
            drTxHash: 0x0000000000000000000000000000000000000000000000000000000000000001,
            cborBytes: hex"1a000702c8"
        });
    }
}
