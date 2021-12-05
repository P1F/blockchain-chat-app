import React, { useEffect, useState } from 'react';
import {
  init, createUser, sendMessage, getMessages, getUsername,
} from './Web3Client';
import './App.css';

const App = function () {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [myAccount, setMyAccount] = useState(null);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    init()
      .then((result) => {
        setProvider(result);
        setHasMetamask(true);
      })
      .catch(alert);
  }, []);

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
      alert('Nome inválido!');
      return;
    }
    /*
    TODO: PROCESSAR CRIAÇÃO DO USER
          Enquanto a promisse não retornar retornar resposta (ou a transação)
          não for completada, colocar um loading.
          Se a transação tiver sucesso, deixa o usuário ir para o chat.
          Caso contrário, retorna um aviso e permance na tela de login.
    */
    const account = await createUser(username);
    if (typeof account === 'object') {
      setIsLoggedIn(true);
      setMyAccount(account);
    } else {
      let msg;
      switch (account) {
        case 0: msg = 'Nenhuma carteira foi selecionada!'; break;
        case 4001: msg = 'Transação rejeitada!'; break;
        default: msg = 'Conta já existente!';
      }

      alert(msg);
    }
  };

  /*
  TODO: MUDANÇA DE CARTEIRA
        Quando o usuário mudar de carteira, deslogar da conta.
  */

  const handleMessageInputChange = (event) => {
    event.preventDefault();
    setMessage(event.target.value);
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    // const transaction = await sendMessage(message);
    // console.log(transaction);
    // setMessage('');

    // testes
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

const Chat = ({ onSubmit, onInputChange, message }) => (
  <div id="sala_chat">
    <div id="historico_mensagens">
      <select multiple="multiple" id="lista_usuarios">
        <option value="">Participantes</option>
      </select>
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
