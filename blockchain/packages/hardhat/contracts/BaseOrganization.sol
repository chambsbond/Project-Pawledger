//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./IOrganization.sol";
import "../models/Employee.sol";

abstract contract BaseOrganization is IOrganization {
	address private _owner;
	mapping(address => Employee) private _employees;

	constructor(address owner, Employee[] memory employees) {
		_owner = owner;
		for (uint i = 0; i < employees.length; i++) {
			_employees[employees[i].walletAddress] = employees[i];
		}
	}

	function addEmployee(Employee memory employee) external override {
		_employees[employee.walletAddress] = employee;
	}

	function removeEmployee(address employeeAddress) external override {
		delete _employees[employeeAddress];
	}

	function isEmployee(
		address employeeAddress
	) external view override returns (bool) {
		return _employees[employeeAddress].walletAddress != address(0x0);
	}
}
