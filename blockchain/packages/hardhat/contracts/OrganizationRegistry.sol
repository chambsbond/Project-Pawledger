//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { IOrganization } from "./IOrganization.sol";
import { OrganizationFactory } from "./OrganizationFactory.sol";
import { Pet } from "./Pet.sol";

contract OrganizationRegistry {
	event OrganizationRegistered(IOrganization);
    event OrganizationValiditySet(IOrganization, bool);
	mapping(IOrganization => bool) private _orgs;
    address private immutable _admin;
    OrganizationFactory private immutable _factory;
    
	constructor(address admin, OrganizationFactory factory) {
        _admin = admin;        
        _factory = factory;
    }

    function getOrganizationFactory() public view returns (OrganizationFactory) {
        return _factory;
    }
    
	//Keep the type IOrg for validation of type
	function registerOrganization(IOrganization org) factoryOnly() public {
        emit OrganizationRegistered(org);
		_orgs[org] = false;
	}

	function isValidated(IOrganization org) public view returns (bool) {
		return _orgs[org];
	}

    function setOrganizationValidity(IOrganization org, bool orgValidity) adminOnly() public {
        emit OrganizationValiditySet(org, orgValidity);
        _orgs[org] = orgValidity;
    }

    modifier adminOnly() {
        require(
            msg.sender == _admin,
            "Only the admin of this contract can all this method"
        );
        _;
    }

    modifier factoryOnly() {
        require(
            msg.sender == address(_factory),
            "Only the Organization Factory contract can call this method"
        );
        _;
    }
}
