import ChatContractBuild from 'contracts/Chat.json';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

let selectedAccount;

let ChatContract;

let isInitialized = false;

export const init = async () => {
  const provider = await detectEthereumProvider();

  if (provider) {
    provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected account is ${selectedAccount}`);
        return provider;
      })
      .catch((err) => {
        console.log(err);
      });

    window.ethereum.on('accountsChanged', (accounts) => {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  } else {
    throw Error('Por favor instale o MetaMask!');
  }

  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();

  console.log('networkId', networkId);

  ChatContract = new web3.eth.Contract(
    ChatContractBuild.abi,
    ChatContractBuild.networks[networkId].address,
  );

  isInitialized = true;
};

export const createUser = async (username) => {
  if (!isInitialized) await init();
  if (!selectedAccount) return null;

  const transaction = await ChatContract.methods
    .createUser(username)
    .send({ from: selectedAccount })
    .then((result) => result)
    .catch((err) => err);

  return selectedAccount;
};

export const sendMessage = async (message) => {
  if (!isInitialized) await init();

  const dateUnix = Math.round(new Date().getTime() / 1000);

  const transaction = await ChatContract.methods
    .createMessage(message, dateUnix)
    .send({ from: selectedAccount })
    .then((result) => result);

  return selectedAccount;
};

export const getUsername = async (address) => {
  console.log('address', address);
  const username = await ChatContract.methods
    .users(address)
    .call()
    .then((result) => result);

  return username;
};

export const getMessages = async () => {
  if (!isInitialized) await init();

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
