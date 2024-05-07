//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../BaseOrganization.sol";

contract AnimalShelter is BaseOrganization {
	string public _name;

	constructor(
		string memory name,
		address owner,
		Employee[] memory employees
	) BaseOrganization(owner, employees) {
		_name = name;
	}

	function onERC721Received(
		address operator,
		address from,
		uint256 tokenId,
		bytes calldata data
	) external returns (bytes4) {
		return IERC721Receiver.onERC721Received.selector;
	}
}
