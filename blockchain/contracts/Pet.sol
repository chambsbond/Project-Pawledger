// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {MintClaimModel} from "../models/MintClaimModel.sol";
import {Chainlink, ChainlinkClient} from "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract Animal is ERC721URIStorage, ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    bytes32 private jobId;
    uint256 private fee;

    event RequestId(bytes32 indexed requestId, string uuid);
    
    uint256 private _nextTokenId;
    uint256 private _nextClaimId;

    address immutable private  _orgRegistryAddress;
    mapping(uint256 => MintClaimModel) private _mintMap;

    constructor(address orgRegistryAddress) ERC721("Animal", "PET") ConfirmedOwner(msg.sender)
    {
        //todo reset these addresses
        _setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);
        _setChainlinkOracle(0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD);
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
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

    function claimOffChainId(uint256 claimId) private returns(bytes32 requestId)
    {
        Chainlink.Request memory req = _buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        req._add(
            "get",
            string.concat("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD", Strings.toString(claimId))
        );

        // Set the path to find the desired data in the API response, where the response format is:
        // {
        //    "id": some uuid,
        //    "claimId: claimid
        // }
        // request.add("path", "RAW.ETH.USD.VOLUME24HOUR"); // Chainlink nodes prior to 1.0.0 support this format
        req._add("path", "id"); // Chainlink nodes 1.0.0 and later support this format
        req._add("path", "claimId");

        // Sends the request
        return _sendChainlinkRequest(req, fee);
    }

    /**
     * Receive the response in the form of uint256
    */
    function fulfill(
        bytes32 _requestId,
        string memory id,
        uint256 claimId
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestId(_requestId, id);
        
        this.mint(claimId, id);
    }

    function mintClaim(address orgAffiliation, address claimee, address prospectOwner)
        public
        onlyRegistry
        returns (uint256)
    {
        MintClaimModel memory claimModel;
        uint256 claimId = _nextClaimId++;

        claimModel.claimee = claimee;
        claimModel.orgAffiliation = orgAffiliation;
        claimModel.prospectOwner = prospectOwner;

        //Todo use queue for cleanup??
        _mintMap[claimId] = claimModel;

        return claimId;
    }

    function mint(uint256 claimId, string memory externalId)
        public
        onlyRegistry
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;

        //TODO validate prospect owner can recieve prior to this call
        _safeMint(_mintMap[claimId].prospectOwner, tokenId);    
     
        _setTokenURI(tokenId, externalId);

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
