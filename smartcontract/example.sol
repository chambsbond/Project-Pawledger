 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Example {

    uint256 public favoriteNumber = 13;

    function store(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns(uint256) {
        return favoriteNumber;
    }
}
