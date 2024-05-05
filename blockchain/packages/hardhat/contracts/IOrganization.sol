// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../model/Employee.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IOrganization is IERC721Receiver {
    function addEmployee(Employee memory employee) external;

    function removeEmployee(address employeeAddress) external;

    //TODO - Add transfer method to return pets to their rightful owners after given scenario.
}