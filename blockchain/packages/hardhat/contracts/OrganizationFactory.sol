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
	address private immutable _deployer;
	address[] private _deployedOrganizations;

	constructor() {
		_deployer = msg.sender;
	}

	function setRegistry(OrganizationRegistry registry) public deployerOnly() {
		_registry = registry;
	}

	function setPet(Pet pet) public deployerOnly() {
		_pet = pet;
	}

	function getPet() public view returns(address) {
		return address(_pet);
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
			return address(org);
		}
		revert("Org type not found");
	}

	modifier deployerOnly() {
		require(msg.sender == _deployer,
			"This method can only be called by the admin"
		);
		_;
	}
}
