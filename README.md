# We do this now

## MUST HAVES
0. Liam - TODO SEE BELOW TODOs (query param on address for better fetching for sac)
1. Jacob - UI: Figure out how to to get transfereePublicKey
2. BE/UI: Add/View charts from portal -> listner to save from smart contract (jacob says thats done)
    a. BE - Alex listener
       - Listen to Pet contract medicalPayload event save that into the db as you get it
         you will get an array with 3 rows to add and you will need to parse them out of 1 message.
    b. UI - Isaac view charts calling smart contract to add new chart
       - Okay to have a text field that will let you put in a tokenId to call the existing API
       - Okay to have a text field that user needs to enter private key into for decrypting the message
       - For adding charts call pet contract recieve med history function. Extra layer of complexitity, 
         insert 3 rows into the medical hisotry table. 1 for us/ chainlink, 1 for org, and 1 for pet owner.
         You can send them all in the same transaction 

## STRECH GOALS
 0. Jacob - UI User side portal
    - Onramp/Dashboard
    - Transfer
    - View Charts
 1. BE: Found Animal Flow
    - UI/Chainlink/BE: Timer for abandoned strays (chainlink points)
 2. Document things we punted on and add link architecture docs -> in a readme 

## LIKEY WONT DO BUT WOULD BE LIT TO GET
 0. General Bug Fixes (state change in verified)
 1. Liam - Deploy UI
 2. Figure out dynamic DON hosted secret
