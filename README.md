# Project Pawledger

This is the _Project Pawledger_ team's submission to _Block Magic: A Chainlink Hackathon_. The team consists of five (5) members: 
* [Jacob Chambers](https://github.com/chambsbond)
* [Liam Rethore](https://github.com/liamliam2020)
* [Alex Moerschbacher](https://github.com/alexmoerschbacher)
* [Austin Sandmhan](https://github.com/sandmhan)
* [Isaac McGonagle](https://github.com/ikemcgon)

## Introduction

What is our app doing

We are tokenizing animals for secure, reliable tracking of pets and strays. We store medical information on the blockchain


## User Guide

### Requirements

packages, depenencies


### How to Deploy

[UI](https://lemon-rock-09e5dbe0f.5.azurestaticapps.net/)

### How to Use

What does a user do when going to the website (also doubles as script for demo)

## Architechtural Diagrams

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