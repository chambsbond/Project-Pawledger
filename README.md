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
We are a group of software engineers from both the public and private sectors of industry. We have all had many opportunities to experiment with cutting edge technologies, but we have not had any opportunites for blockchain tech. It seems as though blockchain has taken the world by storm recently and we found this hackathon as good as any opportunity to dive into getting hands on experience with it.

### Inspiration
Our team lead had the idea for Pawledger after volunteering at his local animal shelter. He thought it would be wonderful if there was a decentralized way to manage a pet's medical history as it can be very hard to have good records for a pet that ends up in an animal shelter. Our pet owner teammates that feel like there could be a more sophisticated way to manage their special friends :) A lot of care goes into their pet's safety and wellbeing and we figured if we had the skills to improve that further then we should absolutley go for it.

### What it does
Project Pawledger is a chainlink application that seeks to tokenize animals for secure, robust tracking of pets and strays. The track features of an animal are it's ownership and medical histories. This gives organizations and owners a resource to reliable maintenance and distribution of animals and pets through calls to Smart Contracts. This git repository contains a web-based user interface for navigating the creation and management of animal tokens.

### How we built it
From an administrative level, we had a development cycle where we reconviend weekly to discuss progress and our goals for the week ahead. We primarily leveraged a Kanban board where we managed our issues and roadmap. These were sufficient for tracking the state of our application over the course of one month.

From a development level, the requirements section below details the software dependencies we used to build the application. We built a frontend to interact with our deployed smart contracts.

### Challenges we ran into
It was not immediately apparent the level of overhead required to deploy contracts on chain. This took a substantial amount of our development time before we got it to work and could go forward. We especially found it challenging to work with because our application depends on limiting features based on organization specific permissions. Organization verification was another challenge we wrestled with a lot.

### Accomplishments that we're proud of
Our biggest accomplishment is simply that we made an application that used chainlink function! Having little knowledge of blockchain ahead of time made us unsure of how deep a dive this hackathon would require, but we met the goal we set out for :)

One fun feature of our project is that we developed and end-to-end encryption schema to allow users to manager their medical history securely.

### What we learned
It's exciting to see how blockchain is still a living tech that is constantly in flux and upgrading. None of us had experience with the tech before starting this Hackathon, so this has been a ground-up learning experience. Additionally, at a higher level we learned a lot about standing up our own project and scoping out the level of effort required to accomplish each component in our month long timeframe.

### What's next for Pawledger
- [x] Chainlink interactions
- [x] Frontend to call contracts
- [x] Database tracking pet entries
- [ ] UI User side portal
    - [x] View Charts
    - [ ] Onramp/Dashboard
    - [ ] Transfer pets
- [ ] Found pet flow
- [ ] Timer for abandoned strays
- [ ] Improvements on organization flow
- [ ] UI for access control for medical data

## User Guide

Below are instructions to deploy and use the _Project Pawledger_ application and smart contracts.

A demonstration video can be found [here]() TODO: ADD LINK TO DEMO VIDEO

### Requirements for Local Development

 - [React](https://react.dev/)
 - [.Net Core 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
 - [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started)
 - [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

### Deployment

- [UI](https://lemon-rock-09e5dbe0f.5.azurestaticapps.net/)

### Usage

What does a user do when going to the website (also doubles as script for demo)

1. Navigate to the UI launch page 
2. Input email to create an organization
3. Use the dashboard !! ( >.< ) 

## Architechtural Diagrams

### Medical Payload Event
![MedicalPayloadEvent](/images/MedicalPayloadEvent.png)
1. User scheudles an appointment through online form
2. All public addresses of organization members are pulled
3. Once a medical payload is sent out the medical payload event emits the medical payload on the pet contract
4. Pawledger API listener takes the medical payload and inserts it into the DB

### DecryptMedicalHistoryFlow
![DecryptMedicalHistoryFlow](/images/DecryptMedicalHistoryFlow.png)
1. User requests their medical history through online form
2. User provides private key in this request for decryption
3. Pawledger API pulls medical history from database
4. Pawledger API returns encrypted medical history
5. Application locally decrpyts medical history with private key 

### TransferPetContractFlow
![TransferPetContractFlow](/images/TransferPetContract.png)
1. Both owner and prospect agree to transfer on pet contract
2. Chainlink logic trigger notifies of the transfer
3. All orgs are pulled from token history
4. All current data owner members for each org are pulled from history
5. Notifications are sent and stored
6. Org members are updated in database
