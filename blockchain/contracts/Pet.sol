// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {OrgAffilliation} from "../models/OrgAffilliation.sol";

contract Pet is ERC721 {
    event MintClaimMade(address orgAffiliation, address claimee, address prospectOwner);
    event FoundClaimMade(uint256 tokenId, address orgAffiliation, address claimee);
    uint256 private _nextTokenId;
    address immutable private  _orgRegistryAddress;

    mapping(uint256 => OrgAffilliation) _foundClaimMap;

    constructor(address orgRegistryAddress) ERC721("Pet", "PET")
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

    function mint(OrgAffilliation memory orgAff, address prospectOwner)
        public
        onlyRegistry
        returns (uint256)
    {
        emit MintClaimMade(orgAff.org, orgAff.claimee, prospectOwner);
        uint256 tokenId = _nextTokenId++;

        //TODO validate prospect owner can recieve prior to this call
        _safeMint(prospectOwner, tokenId);    
     
        return tokenId;
    }

    function foundPetClaim(uint256 tokenId, OrgAffilliation memory orgAff)
        public
        onlyRegistry
    {
        emit FoundClaimMade(tokenId, orgAff.org, orgAff.claimee);

        _foundClaimMap[tokenId] = orgAff;
    }
    
    //may want to enable anyone from the same org to be able to withdraw a claim
    function withdrawClaim(uint256 tokenId, address claimee)
        public
        onlyRegistry()
    {
        require(claimee == _foundClaimMap[tokenId].claimee, "Only the claimee can withdraw a claim");

        delete _foundClaimMap[tokenId];
    }

    function rebukeClaim(uint256 tokenId)
        public
    {
        require(ownerOf(tokenId) == msg.sender, "Only the owner of the pet can rebuke a claim");

        delete _foundClaimMap[tokenId];
    }

    modifier onlyRegistry{
        require(msg.sender == _orgRegistryAddress, "Only the registry can all this");
        _;
    }
}
