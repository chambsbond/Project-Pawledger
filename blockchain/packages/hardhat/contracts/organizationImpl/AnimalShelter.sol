//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// import "../BaseOrganization.sol";
import "../BaseOrganization.sol";
import "../Pet.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../../models/OrgAffilliation.sol";
import "../IOrganization.sol";

contract AnimalShelter is BaseOrganization {
	constructor(
		Pet pet,
		address owner,
		string memory name
	) BaseOrganization(address(pet), owner, name) {
	}

	function registerAnimal(address prospectiveOwner) public onlyEmployee() returns(uint256) {
		return Pet(_pet).mint(OrgAffilliation({org: address(this), claimee: msg.sender}), prospectiveOwner);
	}

	function sendMedicalInfo(address petOwner, string memory payload, uint256 tokenId, bytes32 requestId) public onlyEmployee() {
		Pet(_pet).receiveMedicalPayload(OrgAffilliation({org: address(this), claimee: msg.sender}), petOwner, payload, tokenId, requestId);
	}

	function foundPetClaim(uint256 tokenId) public onlyEmployee() {
		Pet(_pet).foundPetClaim(tokenId, OrgAffilliation({org: address(this), claimee: msg.sender}));
	}

	function adoptAnimal(uint256 tokenId, address user, string memory transfereePublicKey, uint32 gasLimit) public onlyEmployee() {
		Pet(_pet).adoptAnimal(user, tokenId, transfereePublicKey, gasLimit);
	}

	function onERC721Received(
		address operator,
		address from,
		uint256 tokenId,
		bytes calldata data
	) public returns (bytes4) {
		return IERC721Receiver.onERC721Received.selector;
	}
}
