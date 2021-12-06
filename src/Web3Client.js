// import ChatContractBuild from 'contracts/Chat.json';
import ChatContractAbi from 'contracts/abi/ChatAbi.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

const range = (start, end, step = 1) => {
  const output = [];
  for (let i = start; i < end; i += step) {
    output.push(i);
  }
  return output;
};

let ChatContract;

export const init = async () => {
  const provider = await detectEthereumProvider();

  if (!provider) throw Error('Por favor instale o MetaMask!');

  const web3 = new Web3(provider);

  // Uncomment this section when using Ganache/Truffle
  // const networkId = await web3.eth.net.getId();

  // ChatContract = new web3.eth.Contract(
  //   ChatContractBuild.abi,
  //   ChatContractBuild.networks[networkId].address,
  // );

  // Contract deployed in public network
  const address = '0x919B63771fd943701D7f7c25d15f3F648C194422';
  ChatContract = new web3.eth.Contract(ChatContractAbi, address);

  return { web3, provider };
};

export const createUser = async (username, address) => {
  const transaction = await ChatContract.methods
    .createUser(username)
    .send({ from: address })
    .then((result) => result)
    .catch(() => null);

  return transaction;
};

export const sendMessage = async (message, address) => {
  const dateUnix = Math.round(new Date().getTime() / 1000);

  const transaction = await ChatContract.methods
    .createMessage(message, dateUnix)
    .send({ from: address })
    .then((result) => result);

  return transaction;
};

export const getUsername = async (address) => {
  const username = await ChatContract.methods
    .users(address)
    .call()
    .then((result) => result);

  return username;
};

export const getAllMessages = async () => {
  const messagesCount = await ChatContract.methods.messagesCount.call().call();

  const messages = await Promise.all(
    range(0, messagesCount).map((i) => ChatContract.methods
      .messages(i + 1)
      .call()
      .then(async (result) => {
        const {
          id, sender, content, date,
        } = result;
        const senderUsername = await getUsername(sender);
        const dateFormat = (new Date(date * 1000)).toLocaleString('pt-BR');
        return {
          id, senderUsername, content, dateFormat,
        };
      })),
  ).then((result) => result);

  return messages;
};

export const getAllUsernames = async () => {
  const usersCount = await ChatContract.methods.usersCount.call().call();

  const users = await Promise.all(
    range(0, usersCount).map((i) => ChatContract.methods
      .addresses(i + 1)
      .call()
      .then(async (result) => {
        const address = result;
        const username = await getUsername(address);
        return username;
      })),
  ).then((result) => result);

  return users;
};
