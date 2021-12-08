# EXAME CES27 - Blockchain Chat

A decentralized chat based on ethereum.

## Before you run it locally

1. Install dependencies
```
$ npm install
```
2. Install [Ganache](https://trufflesuite.com/ganache/).\
Ganache helps you creating a local blockchain on your computer memory by quickly firing up a personal Ethereum blockchain.

3. Install truffle globally using `npm`. Truffle helps you compiling and deploying your smart contract on your local blockchain.
```
$ npm install -g truffle
```
4. Run Ganache in a personal workspace related referencing `truffle-config.js`.\
http://trufflesuite.com/docs/ganache/workspaces/creating-workspaces
5. Go into `/truffle` directory, compile and deploy the smart contracts.
```
$ sudo truffle compile
$ sudo truffle migrate
```
6. Run the app
```
$ npm start
```
