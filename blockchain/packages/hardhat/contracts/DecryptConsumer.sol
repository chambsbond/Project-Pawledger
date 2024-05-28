//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import { Pet } from "./Pet.sol";

contract DecryptConsumer is FunctionsClient {
	using FunctionsRequest for FunctionsRequest.Request;
	uint256 private _requestCounter;
	event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

	string private calculationLogic;
	bytes32 private donId;
	Pet private immutable pet;

	constructor(
		address oracle,
		bytes32 _donId,
		string memory _calculationLogic,
		Pet _pet
	) FunctionsClient(oracle) {
		donId = _donId;
		calculationLogic = _calculationLogic;
		pet = _pet;
	}

	// subscriptionId is for chainLink
	// args may not be needed
	function reEncryptMedicalRecords(
		string[] memory args,
		uint32 gasLimit
	) public returns (bytes32) {
		FunctionsRequest.Request memory req;
		
		args[3] = Strings.toString(_requestCounter);

		req.initializeRequest(
			FunctionsRequest.Location.Inline,
			FunctionsRequest.CodeLanguage.JavaScript,
			calculationLogic
		);

		req.addDONHostedSecrets(
			0,
			1716848112
		);
		
		req.setArgs(args);

		bytes32 assignedReqID = _sendRequest(
			req.encodeCBOR(),
			231,
			gasLimit,
			donId
		);
		return assignedReqID;
	}

	/**
	 * @notice Callback that is invoked once the DON has resolved the request or hit an error
	 *
	 * @param requestId The request ID, returned by sendRequest()
	 * @param response Aggregated response from the user code
	 * @param err Aggregated error from the user code or from the execution pipeline
	 * Either response or error parameter will be set, but never both
	 */
	function fulfillRequest(
		bytes32 requestId,
		bytes memory response,
		bytes memory err
	) internal override {
		pet.eventsDecryted(requestId, response, err);
	}
}
