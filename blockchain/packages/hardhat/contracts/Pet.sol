//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { OrgAffilliation } from "../models/OrgAffilliation.sol";
import { OrganizationRegistry } from "./OrganizationRegistry.sol";
import { IOrganization } from "./IOrganization.sol";

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
	event ReceivePayload(
		string payload
	);
	uint256 private _nextTokenId;
	OrganizationRegistry private immutable _orgRegistry;

	mapping(uint256 => OrgAffilliation) _foundClaimMap;

	constructor(OrganizationRegistry orgRegistry) ERC721("Pet", "PET") {
		_orgRegistry = orgRegistry;
	}

	function _baseURI() internal pure override returns (string memory) {
		return "metaservice uri here";
	}

	function getNextId() public view returns (uint256) {
		return _nextTokenId;
	}

	function mint(
		OrgAffilliation memory orgAff,
		address prospectOwner
	) public onlyValidOrg returns (uint256) {
		emit MintClaimMade(orgAff.org, orgAff.claimee, prospectOwner);
		uint256 tokenId = _nextTokenId++;

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

	function receivePayload(
		string memory payload
	) public onlyValidOrg {
		emit ReceivePayload(payload);
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

	modifier onlyValidOrg() {
		require(
			_orgRegistry.isValidated(IOrganization(msg.sender)),
			"Only a registered user of a validated organization can use this function"
		);
		_;
	}
}
