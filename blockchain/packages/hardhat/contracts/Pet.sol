//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { OrgAffilliation } from "../models/OrgAffilliation.sol";
import { OrganizationRegistry } from "./OrganizationRegistry.sol";
import { IOrganization } from "./IOrganization.sol";
import { DecryptConsumer } from "./DecryptConsumer.sol";

contract Pet is ERC721 {
	event MintClaimMade(
		address orgAffiliation,
		address claimee,
		address prospectOwner
	);
	event FoundClaimMade(
		uint256 tokenId,
		address orgAffiliation,
		address claimee
	);
	event MedicalPayload(
		address orgAffiliation,
		address claimee,
		address prtOwner,
		string medPayload
	);
	event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
	uint256 private _nextTokenId;
	OrganizationRegistry private immutable _orgRegistry;
	DecryptConsumer public immutable _decryptConsumer;

	mapping(uint256 => OrgAffilliation) _foundClaimMap;

	constructor(
		OrganizationRegistry orgRegistry,
		address functionRouter,
		// bytes32 donId,
		string memory calculationLogic
	) ERC721("Pet", "PET") {
		_orgRegistry = orgRegistry;
		_decryptConsumer = new DecryptConsumer(
			functionRouter,
			"fun-polygon-amoy-1",
			calculationLogic,
			this
		);
	}

	function getDecryptContract() public view returns(DecryptConsumer) {
		return _decryptConsumer;
	}

	function _baseURI() internal pure override returns (string memory) {
		return "metaservice uri here";
	}

	function getNextId() public view returns (uint256) {
		return _nextTokenId;
	}

	function mint(
		OrgAffilliation memory orgAff,
		address prospectOwner,
		uint32 gasLimit
	) public onlyValidOrg returns (uint256) {
		emit MintClaimMade(orgAff.org, orgAff.claimee, prospectOwner);
		uint256 tokenId = _nextTokenId++;

		// string[] calldata args = ["test", "pop"];
		_decryptConsumer.testApiCall(gasLimit);

		//TODO validate prospect owner can recieve prior to this call
		_safeMint(prospectOwner, tokenId);

		return tokenId;
	}

	function foundPetClaim(
		uint256 tokenId,
		OrgAffilliation memory orgAff
	) public onlyValidOrg {
		emit FoundClaimMade(tokenId, orgAff.org, orgAff.claimee);

		_foundClaimMap[tokenId] = orgAff;
	}

	function receiveMedicalPayload(
		OrgAffilliation memory orgAff,
		address petOwner,
		string memory medPayload
	) public onlyValidOrg {
		emit MedicalPayload(orgAff.org, orgAff.claimee, petOwner, medPayload);
	}

	//may want to enable anyone from the same org to be able to withdraw a claim
	function withdrawClaim(
		uint256 tokenId,
		address claimee
	) public onlyValidOrg {
		require(
			claimee == _foundClaimMap[tokenId].claimee,
			"Only the claimee can withdraw a claim"
		);

		delete _foundClaimMap[tokenId];
	}

	function rebukeClaim(uint256 tokenId) public {
		require(
			ownerOf(tokenId) == msg.sender,
			"Only the owner of the pet can rebuke a claim"
		);

		delete _foundClaimMap[tokenId];
	}

	function eventDecryted(
		bytes32 requestId,
		bytes memory response,
		bytes memory err
	) public {
		emit OCRResponse(requestId, response, err);
	}

	modifier onlyValidOrg() {
		require(
			_orgRegistry.isValidated(IOrganization(msg.sender)),
			"Only a registered user of a validated organization can use this function"
		);
		_;
	}
}
