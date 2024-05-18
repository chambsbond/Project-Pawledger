//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./IOrganization.sol";

abstract contract BaseOrganization is IOrganization {
	string public _name;
	address private _owner;
	address public immutable _pet;
	mapping(address => bool) private _employees;

	constructor(address pet, address owner, string memory name) {
		_owner = owner;
		_employees[owner] = true;
		_pet = pet;
		_name = name;
	}

	function addEmployee(address employee) public onlyOwner {
		_employees[employee] = true;
	}

	function removeEmployee(address employeeAddress) public onlyOwner {
		delete _employees[employeeAddress];
	}

	function isOwner(address ownerAddress) public view returns (bool) {
		return _owner == ownerAddress;
	}

	function isEmployee(address employeeAddress) public view returns (bool) {
		return _employees[employeeAddress];
	}

	modifier onlyEmployee() {
		require(
			_employees[msg.sender],
			"Must be an employee to use this function"
		);
		_;
	}

	modifier onlyOwner() {
		require(
			msg.sender == _owner,
			"Must be the owner of this organization to use this function"
		);
		_;
	}
}
