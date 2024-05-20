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

	function sendPetInfo(string memory payload) public onlyEmployee() {
		Pet(_pet).receivePayload(payload);
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
