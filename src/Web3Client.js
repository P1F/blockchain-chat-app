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
      })
      .catch((err) => {
        console.log(err);
      });

    window.ethereum.on('accountsChanged', (accounts) => {
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  } else {
    throw Error('Please install MetaMask!');
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

  const transaction = await ChatContract.methods
    .createUser(username)
    .send({ from: selectedAccount })
    .then(console.log);

  return transaction;
};

export const sendMessage = async (message) => {
  if (!isInitialized) await init();

  const dateUnix = Math.round(new Date().getTime() / 1000);
  console.log('dateUnix', dateUnix);
  const transaction = await ChatContract.methods
    .createMessage(message, dateUnix)
    .send({ from: selectedAccount })
    .then(console.log);

  return transaction;
};

export const getUsername = async (address) => {
  const username = await ChatContract.methods
    .users(address)
    .call()
    .then((result) => result.name);

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
