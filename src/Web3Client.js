import ChatContractBuild from 'contracts/Chat.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

let ChatContract;

export const init = async () => {
  const provider = await detectEthereumProvider();

  if (!provider) throw Error('Por favor instale o MetaMask!');

  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();

  ChatContract = new web3.eth.Contract(
    ChatContractBuild.abi,
    ChatContractBuild.networks[networkId].address,
  );

  console.log('ChatContract', ChatContract);

  return provider;
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

export const getMessages = async () => {
  const messagesCount = await ChatContract.methods.messagesCount.call().call();
  const messages = new Array(messagesCount);
  for (let i = 1; i <= messagesCount; i += 1) {
    ChatContract.methods
      .messages(i)
      .call()
      .then((result) => {
        const { sender, content, date } = result;
        messages[i - 1] = { sender, content, date };
      });
  }

  return messages;
};

export const getAllUsernames = async () => {
  const usersCount = await ChatContract.methods.usersCount.call().call();
  const users = new Array(usersCount);
  for (let i = 1; i <= usersCount; i += 1) {
    ChatContract.methods
      .addresses(i)
      .call()
      .then(async (result) => {
        const address = result;
        const username = await getUsername(address);
        users[i - 1] = username;
      });
  }

  return users;
};
