// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../model/Employee.sol";

interface IOrganization {
    function addEmployee(Employee memory employee) external;

    function removeEmployee(address employee) external;
}