//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../enums/OrganizationType.sol";
import "./organizationImpl/AnimalShelter.sol";
import "../models/Employee.sol";

contract MyTokenFactory {
	address[] public _deployedOrganizations;

	function createOrganization(
		OrganizationType organizationType,
		string memory name,
		address owner,
		Employee[] memory employees
	) public {
		if (organizationType == OrganizationType.AnimalShelter) {
			address newToken = address(
				new AnimalShelter(name, owner, employees)
			);
			_deployedOrganizations.push(newToken);
		}
	}

	function getDeployedOrganizations() public view returns (address[] memory) {
		return _deployedOrganizations;
	}
}
