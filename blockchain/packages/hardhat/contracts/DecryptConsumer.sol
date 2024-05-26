//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import { FunctionsClient } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import { Pet } from "./Pet.sol";

contract DecryptConsumer is FunctionsClient {
	using FunctionsRequest for FunctionsRequest.Request;

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
		string memory transfereePublicKey,
		uint256 tokenId,
		uint32 gasLimit
	) public returns (bytes32) {
		FunctionsRequest.Request memory req;
		// string[] memory args;// = [Strings.toString(tokenId), transfereePublicKey, "mDMEZlJsrhYJKwYBBAHaRw8BAQdAtTjnExj2iuKRArmOf+MxS222Q+y+OOC2yCMXPDRm4iG0DExpYW0gUmV0aG9yZYiZBBMWCgBBFiEEwV7wBxoB9xi4H7ri6AuRm+FmNRgFAmZSbK4CGwMFCQWjYwIFCwkIBwICIgIGFQoJCAsCBBYCAwECHgcCF4AACgkQ6AuRm+FmNRix8gD/XOJdBswbRCUOae1yGQiEEkivtnG1YgS8sYsP1R8WFJgA/j/LhvPXS9Y0sWY42ZP/3o9ro/E2zfI2Rj73BbU2euMNuDgEZlJsrhIKKwYBBAGXVQEFAQEHQLlgTfKWfkwLsul/FCXY8iXOJUF2XcZ2+AG1AIey7x1EAwEIB4h+BBgWCgAmFiEEwV7wBxoB9xi4H7ri6AuRm+FmNRgFAmZSbK4CGwwFCQWjYwIACgkQ6AuRm+FmNRhGWwEA20Cj1/UWgB1J5U0DZ6AQhVLg1icBTVqaK4xvmZQvw2oA/1VNxClukmMfOymonjo1KWQaqy/GTMvm4MhaP313NjMP=v7hr"];
		
		req.initializeRequest(
			FunctionsRequest.Location.Inline,
			FunctionsRequest.CodeLanguage.JavaScript,
			calculationLogic
		);

		req.addDONHostedSecrets(
			0,
			0
		);
		
		// req.setArgs(args);

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
