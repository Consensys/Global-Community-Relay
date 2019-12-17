# Submission for the Labs Open Finance Bounties

## Melke

## Project Summary
Melke is offchain scaling solution for ethereum. The basic idea of Melke is that we make Merkle tree of of many transactions and only Merkle root will be in chain. Users can send transactions to Melke nodes, which build Merkle trees and broadcast roots to chain. Because we can verify all transactions which isn't in chain with Merkle root, Melke allow us to build smart contract that can process data which isn't in chain. If we would have to prove in smart contract that some trnsaction was in Melke, we would need to build Merkle tree in smart contract which would be expensive. We invented Cheap Verifying Technique(CVT) to solve this problem. You just need to tell transaction that you need to prove and Merkle root for it to function in Melke.sol. Melke nodes keep watching this function, if nodes see that there isn't transaction that you claimed in root you claimed, they ask you to prove that you didn't lie. Then you need tu build Merkle tree in smart contract to prove that you didn't lied. When Melke node ask you to prove your claim, they deposit to contract enough ether to prove your claim right with building Merkle tree. If you can prove that you didn't lie, you get moneys that node deposit to contract, otherwise node get tokens back. Like this it isn't wise to try cheat, you would lose money!

## Project Team

* xVETTEx/Väinö Toivonen
* vaino.toivonen@protonmail.com 

## Link to Ancillary Material


- **Repository: https://github.com/xVETTEx/Melke-protocl/**
- **Documentation: https://github.com/xVETTEx/Meke-protocol/wiki/**
