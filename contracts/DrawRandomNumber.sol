pragma solidity 0.4.19;

import "./OraclizeAPI.sol";


contract DrawRandomNumber is usingOraclize {
    event NewRandomNumberBytes(bytes);
    event NewRandomNumberUint(uint);
    event LogProof(bytes proof);
    /* uint256 public random; */
    /* uint256 public maxRange; */

    //mappings
    mapping (bytes32 => bool) public validIds;
    // mapping of the highest uint we want to get.
    mapping (bytes32 => uint256) public maxRanges;
    mapping (bytes32 => uint256) public randomNumbers;

    // the callback function is called by Oraclize when the result is ready
    // the oraclize_randomDS_proofVerify modifier prevents an invalid proof to execute this function code:
    // the proof validity is fully verified on-chain
    function __callback(bytes32 _queryId, string _result, bytes _proof) public
    {
        require(msg.sender == oraclize_cbAddress() && validIds[_queryId]);

        // this is an efficient way to get the uint out in the [1, maxRange] range
        uint256 randomNumber = uint(keccak256(_result)) % maxRanges[_queryId];
        randomNumber += 1;

        NewRandomNumberBytes(bytes(_result)); // this is the resulting random number (bytes)
        NewRandomNumberUint(randomNumber); // this is the resulting random number (uint)
        LogProof(_proof);
        randomNumbers[_queryId] = randomNumber;
        validIds[_queryId] = false;
    }

    function generateRandomNum(uint256 _maxRange) public payable returns(bytes32) {
        oraclize_setProof(proofType_Ledger); // sets the Ledger authenticity proof
        uint n = 4; // number of random bytes we want the datasource to return
        uint delay = 0; // number of seconds to wait before the execution takes place
        uint callbackGas = 200000; // amount of gas we want Oraclize to set for the callback function

        // this function internally generates the correct oraclize_query and returns its queryId
        bytes32 queryId = oraclize_newRandomDSQuery(delay, n, callbackGas);
        maxRanges[queryId] = _maxRange;
        validIds[queryId] = true;
        return queryId;
    }
}
