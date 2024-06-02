# Project Pawledger

<p  align="center">
  <img src="./images/pawledger.png"/>
</p>

This is the _Project Pawledger_ team's submission to [_Block Magic: A Chainlink Hackathon_](https://chain.link/hackathon) under the category of "Gaming & Consumer Apps." The team consists of five (5) members: 
* [Jacob Chambers](https://github.com/chambsbond)
* [Liam Rethore](https://github.com/liamliam2020)
* [Alex Moerschbacher](https://github.com/alexmoerschbacher)
* [Austin Sandmhan](https://github.com/sandmhan)
* [Isaac McGonagle](https://github.com/ikemcgon)


## About the Project

_Project Pawledger_ is a chainlink application that seeks to tokenize animals for secure, robust tracking of pets and strays. The track features of an animal are it's ownership and medical histories. This gives organizations and owners a resource to reliable maintanence and distribution of animals and pets through calls to Smart Contracts. This git repository contains a web-based user interface for navigating the creation and management of animal tokens.

## User Guide

Below are instructions to deploy and use the _Project Pawledger_ application and smart contracts.

A demonstration video can be found [here]() TODO: ADD LINK TO DEMO VIDEO

### Requirements

 [![React][React.js]][React-url]

### How to Deploy

How can a developer start the project

### How to Use

What does a user do when going to the website (also doubles as script for demo)

## Architechtural Diagrams

<<<<<<< Updated upstream
<<<<<<< Updated upstream
![MedicalPayloadEvent](/images/MedicalPayloadEvent.png)
1. User scheudles an appointment through online form
2. All public addresses of organization members are pulled
3. Once a medical payload is sent out the medical payload event emits the medical payload on the pet contract
4. Pawledger API listener takes the medical payload and inserts it into the DB

![DecryptMedicalHistoryFlow](/images/DecryptMedicalHistoryFlow.png)
1. User requests their medical history through online form
2. User provides private key in this request for decryption
3. Pawledger API pulls medical history from database
4. Pawledger API returns encrypted medical history
5. Application locally decrpyts medical history with private key 

![TransferPetContractFlow](/images/TransferPetContract.png)
1. Both owner and prospect agree to transfer on pet contract
2. Chainlink logic trigger notifies of the transfer
3. All orgs are pulled from token history
4. All current data owner members for each org are pulled from history
5. Notifications are sent and stored
6. Org members are updated in database
=======
=======
>>>>>>> Stashed changes
[Lucid Diagrams](https://lucid.app/lucidchart/c9126827-a861-4236-8a60-c49f2c96c098/edit?beaconFlowId=3DE2DC55D07BA9B5&invitationId=inv_834774fb-d3e0-4739-9b89-4ae3fe90b31b&page=0_0#)

## Future Work and Limitations

Discuss where the project would go from here

Maybe identify limiting points of our current implementation?
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
