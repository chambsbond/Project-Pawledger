//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface IOrganization is IERC721Receiver {
	function addEmployee(address employee) external;

    function removeEmployee(address employeeAddress) external;

    function isEmployee(address employeeAddress) external view returns (bool);

	//TODO - Add transfer method to return pets to their rightful owners after given scenario.
}
