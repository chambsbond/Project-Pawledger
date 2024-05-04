// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {MintClaimModel} from "../models/MintClaimModel.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract Animal is ERC721 {
    event ClaimMade(address orgAffiliation, address claimee, address prospectOwner);    
    uint256 private _nextTokenId;
    address immutable private  _orgRegistryAddress;

    constructor(address orgRegistryAddress) ERC721("Animal", "PET")
    {
        _orgRegistryAddress = orgRegistryAddress;
    }

    function _baseURI() internal pure override returns (string memory)
    {
        return "metaservice uri here";
    }

    function getNextId() public view returns (uint256) 
    {
        return _nextTokenId;
    }

    function mint(address orgAffiliation, address claimee, address prospectOwner)
        public
        onlyRegistry
        returns (uint256)
    {
        emit ClaimMade(orgAffiliation, claimee, prospectOwner);
        uint256 tokenId = _nextTokenId++;

        //TODO validate prospect owner can recieve prior to this call
        _safeMint(prospectOwner, tokenId);    
     
        return tokenId;
    }


    //replace claimee with Org
    function foundAnimal(uint256 tokenId, address orgAffiliation, address claimee)
        public
        onlyRegistry
    {

    }

    modifier onlyRegistry{
        require(msg.sender == _orgRegistryAddress, "Only the registry can all this");
        _;
    }
}
