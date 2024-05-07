//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { IOrganization } from "./IOrganization.sol";
import { Pet } from "./Pet.sol";

contract OrganizationRegistry {
	event OrganizationRegistered(IOrganization);
    event OrganizationValiditySet(IOrganization, bool);
	mapping(IOrganization => bool) private _orgs;
    address private immutable _admin;
    
    //TODO add deployer as constructor dep and immutable
	constructor(address admin) {
        _admin = admin;
    }    

	//Keep the type IOrg for validation of type
    //TODO require this to be deployer contract
	function registerOrganization(IOrganization org) public {
        emit OrganizationRegistered(org);
		_orgs[org] = false;
	}

	function isValidated(IOrganization org) public view returns (bool) {
		return _orgs[org];
	}

    function setOrganizationValidity(IOrganization org, bool orgValidity) public {
        emit OrganizationValiditySet(org, orgValidity);
        _orgs[org] = orgValidity;
    }
}
