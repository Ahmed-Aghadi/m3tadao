Tableland in m3tadao is the most used tech. With tableland we are indexing all data into our tables
We have created this tables into our contracts, that way only our contracts are having the access control to write&update table raws

TABLES : 
=> m3taUser where we are storing all the LensProfiles data + (some additional data like all cids to win some recursive cid lookUp time)
created by our contract. Here is a query to take m3tadao current registed users
(https://testnet.tableland.network/query?s=SELECT%20*%20FROM%20M3taUser_80001_3140)
          
=> m3taAccount table where we are storing all ValistOpgranization Profiles and additional data for better UX.
       (https://testnet.tableland.network/query?s=SELECT%20*%20FROM%20M3taAccount_80001_3141)
       
=> m3taProject for Projects inside an Organization 
       https://testnet.tableland.network/query?s=SELECT%20*%20FROM%20M3taProject_80001_3142
       
=> We also created a Post table to add posts also into the valist Accounts 
       (https://testnet.tableland.network/query?s=SELECT%20*%20FROM%20M3taPost_80001_3144)
       
=> The last and best table is used for every m3tauser that wants to make a hiring request into an organization
       That way Organization owners can see into their organization Hiring dashboard requests and then create a private chat "powered by XMTP"
       and also make a planned Automated streams between contributors! 
       The hiring table is located here: 
       https://testnet.tableland.network/query?s=SELECT%20*%20FROM%20M3taHire_80001_3143
       
       
Tableland was a pretty nice integration because it gaves us the oportunity to index our signed user data by making a query with his wallet data.

in that manner we are getting fast profile loading times and we also have the proper IDs to then fetch with that IDs more specific data using TheGraph!

Also it gave us the oppportunity to keep our Database safe cause of the ac only by the contract but moreover for creating the Hiring table anf Post table to 

cover our Organizations usecases!


Here is the hook where we are making the Queries from the backend : https://github.com/Suhel-Kap/m3tadao/blob/mantine/hooks/useTableland.js


       
       