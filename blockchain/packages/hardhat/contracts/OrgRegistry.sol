//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { IOrganization } from "./IOrganization.sol";
import { Pet } from "./Pet.sol";

contract OrgRegistry {
	event OrgRegistered(IOrganization);
    event OrgValiditySet(IOrganization, bool);
	mapping(IOrganization => bool) private _orgs;
    address private immutable _admin;
    
    //TODO add deployer as constructor dep and immutable
	constructor(address admin) {
        _admin = admin;
    }    

	//Keep the type IOrg for validation of type
    //TODO require this to be deployer contract
	function registerOrg(IOrganization org) public {
        emit OrgRegistered(org);
		_orgs[org] = false;
	}

	function canModifyPet(IOrganization org) public view returns (bool) {
		return _orgs[org];
	}

    function setOrgValidity(IOrganization org, bool orgValidity) public {
        emit OrgValiditySet(org, orgValidity);
        _orgs[org] = orgValidity;
    }
}
