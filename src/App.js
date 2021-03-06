import React, { useEffect, useState, useRef } from 'react';
import {
  init, createUser, sendMessage, getUsername, getAllMessages, getAllUsernames,
} from './Web3Client';
import './App.css';

const App = function () {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [myAddress, setMyAddress] = useState(null);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [msgHistory, setMsgHistory] = useState([]);

  const messageEndRef = useRef();

  const updateChat = async () => {
    // Get all usernames and messages from the chain
    const users = await getAllUsernames();
    const messages = await getAllMessages();
    // Update users list and message history
    setUsersList(users);
    setMsgHistory(messages);
  };

  useEffect(() => {
    init()
      .then((result) => {
        let selectedAccount;
        const { web3, provider } = result;

        setHasMetamask(true);

        // TODO: QUANDO O CARA MUDAR DE CARTEIRA, DESLOGAR
        // Request accounts and set the selected one
        provider
          .request({ method: 'eth_requestAccounts' })
          .then((accounts) => {
            selectedAccount = accounts[0];
            setMyAddress(selectedAccount);
            console.log(`Selected account is ${selectedAccount}`);
          })
          .catch((err) => {
            console.log(err);
          });

        // Set selected account on change
        provider.on('accountsChanged', (accounts) => {
          selectedAccount = accounts[0];
          setMyAddress(selectedAccount);
          console.log(`Selected account changed to ${selectedAccount}`);
        });

        // Subscribe to incoming block headers.
        // This can be used as timer to check for changes on the blockchain.
        web3.eth.subscribe('newBlockHeaders', () => {
          updateChat();
        });
      })
      .catch(alert);
  }, []);

  // Deslogar se mudar a carteira enquanto logado
  useEffect(() => {
    if (isLoggedIn) window.location.reload();
  }, [myAddress]);

  // Rolar automaticamente para mensagens mais recentes
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msgHistory]);

  const handleLoginInputChange = (event) => {
    event.preventDefault();
    setUsername(event.target.value);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (!hasMetamask) {
      alert('Por favor instale o MetaMask!');
      return;
    }

    const isValidUsername = /^[0-9a-zA-Z_.-]+$/.test(username);
    if (!isValidUsername) {
      alert('Apelido inv??lido!');
      return;
    }

    const myUsername = await getUsername(myAddress);
    if (myUsername) {
      if (myUsername !== username) {
        alert(`Seu apelido ?? '${myUsername}'`);
      } else {
        setIsLoggedIn(true);
        // initialize chat
        updateChat();
      }
      return;
    }
    /*
    TODO: PROCESSAR CRIA????O DO USER
          Enquanto a promisse n??o retornar retornar resposta (ou a transa????o)
          n??o for completada, colocar um loading.
          Se a transa????o tiver sucesso, deixa o usu??rio ir para o chat.
          Caso contr??rio, retorna um aviso e permance na tela de login.
    */
    const transaction = await createUser(username, myAddress);
    if (transaction) {
      setIsLoggedIn(true);
      // initialize chat
      updateChat();
    } else {
      alert('Um erro ocorreu durante a transa????o.');
    }
  };

  /*
  TODO: MUDAN??A DE CARTEIRA
        Quando o usu??rio mudar de carteira, deslogar da conta.
  */

  const handleMessageInputChange = (event) => {
    event.preventDefault();
    setMessage(event.target.value);
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    const transaction = await sendMessage(message, myAddress);
    console.log(transaction);
    setMessage('');
  };

  return (
    <div className="App">
      {!isLoggedIn && (
        <Login
          onSubmit={handleLoginSubmit}
          onInputChange={handleLoginInputChange}
          username={username}
        />
      )}
      {isLoggedIn && (
        <Chat
          onSubmit={handleMessageSubmit}
          onInputChange={handleMessageInputChange}
          message={message}
          users={usersList}
          messageHistory={msgHistory}
          myUsername={username}
          messageEndRef={messageEndRef}
        />
      )}
    </div>
  );
};

const Login = ({ onSubmit, onInputChange, username }) => (
  <div id="acesso_usuario">
    <form id="login" onSubmit={onSubmit}>
      <input
        type="text"
        id="apelido"
        name="apelido"
        value={username}
        autoFocus
        placeholder="Insira seu apelido"
        onChange={onInputChange}
      />
      <input type="submit" value="Entrar" />
    </form>
  </div>
);

const Chat = ({
  onSubmit, onInputChange, message, users, messageHistory, myUsername, messageEndRef,
}) => (
  <div id="sala_chat">
    <div id="historico_mensagens">
      <select multiple="multiple" id="lista_usuarios">
        <option value="">Participantes</option>
        {users.map((user) => (
          <option value={user} key={user}>{user}</option>
        ))}
      </select>
      <div id="mensagens">
        {messageHistory.map((msg) => {
          const isMyMessage = msg.senderUsername === myUsername;
          const msgType = isMyMessage ? 'minha' : 'outro';
          return (
            <div id="mensagem" className={msgType}>
              <div className="info">
                {!isMyMessage && <span key={`${msg.id}-sender`}>{`${msg.senderUsername}:`}</span>}
                <span key={`${msg.id}-content`}>{msg.content}</span>
              </div>
              <div className="data">
                <span key={`${msg.id}-date`}>{msg.dateFormat}</span>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
    </div>
    <form id="chat" onSubmit={onSubmit}>
      <input
        type="text"
        id="texto_mensagem"
        name="texto_mensagem"
        value={message}
        autoFocus
        placeholder="Insira sua mensagem"
        onChange={onInputChange}
      />
      <input type="submit" value="Enviar mensagem!" />
    </form>
  </div>
);
export default App;
