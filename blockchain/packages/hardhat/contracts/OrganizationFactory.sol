//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../enums/OrganizationType.sol";
import "./BaseOrganization.sol";
import "./organizationImpl/AnimalShelter.sol";
import "./OrganizationRegistry.sol";
import "./Pet.sol";

contract OrganizationFactory {	
	OrganizationRegistry private _registry;
	Pet private _pet;
	address private immutable _admin;
	address[] private _deployedOrganizations;

	constructor(address admin) {
		_admin = admin;
	}

	function setRegistry(OrganizationRegistry registry) public adminOnly() {
		_registry = registry;
	}

	function setPet(Pet pet) public adminOnly() {
		_pet = pet;
	}

	function getRegistry() public view returns(address){
		return address(_registry);
	}

	function getDeployedOrgs() public view returns(address[] memory){
		return _deployedOrganizations;
	}

	function createOrganization(
		OrganizationType organizationType,
		string memory name,
		address owner
	) public returns (address) {
		if (organizationType == OrganizationType.AnimalShelter) {
			AnimalShelter org = new AnimalShelter(_pet, owner, name);
			_registry.registerOrganization(org);
			_deployedOrganizations.push(address(org));
		}
		return address(0);
	}

	modifier adminOnly() {
		require(msg.sender == _admin,
			"This method can only be called by the admin"
		);
		_;
	}
}
