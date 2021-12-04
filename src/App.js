import React, { useEffect, useState } from 'react';
import {
  init, createUser, sendMessage, getMessages,
} from './Web3Client';
import './App.css';

const App = function () {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   init();
  // });

  const handleLoginInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
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
    const transaction = await createUser(username);
    console.log(transaction);
    setIsLoggedIn(true);
  };

  const handleMessageInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    // const transaction = await sendMessage(message);
    // console.log(transaction);
    // setMessage('');
    const msgs = await getMessages();
    console.log('msgs', msgs);
  };

  const Login = function () {
    return (
      <div id="acesso_usuario">
        <form id="login" onSubmit={handleLoginSubmit}>
          <input
            type="text"
            id="apelido"
            name="apelido"
            value={username}
            autoFocus
            placeholder="Insira seu apelido"
            onChange={handleLoginInputChange}
          />
          <input type="submit" value="Entrar" />
        </form>
      </div>
    );
  };

  const Chat = function () {
    return (
      <div id="sala_chat">
        <div id="historico_mensagens">
          <select multiple="multiple" id="lista_usuarios">
            <option value="">Participantes</option>
          </select>
        </div>
        <form id="chat" onSubmit={handleMessageSubmit}>
          <input
            type="text"
            id="texto_mensagem"
            name="texto_mensagem"
            value={message}
            autoFocus
            placeholder="Insira sua mensagem"
            onChange={handleMessageInputChange}
          />
          <input type="submit" value="Enviar mensagem!" />
        </form>
      </div>
    );
  };

  return (
    <div className="App">
      {!isLoggedIn && <Login />}
      {isLoggedIn && <Chat />}
    </div>
  );
};

export default App;
