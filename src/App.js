import React, { useState } from 'react';
import {} from './Web3Client';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValidUsername = /^[0-9a-zA-Z_.-]+$/.test(username);
    if (!isValidUsername) {
      alert('Nome inválido!');
      return;
    }
    setIsLoggedIn(true);
  };

  const Login = () => {
    return (
      <div id='acesso_usuario'>
        <form id='login' onSubmit={handleSubmit}>
          <input
            type='text'
            id='apelido'
            name='apelido'
            value={username}
            autoFocus
            placeholder='Insira seu apelido'
            onChange={handleChange}
          />
          <input type='submit' value='Entrar' />
        </form>
      </div>
    );
  };

  const Chat = () => {
    return (
      <div id='sala_chat'>
        <div id='historico_mensagens'>
          <select multiple='multiple' id='lista_usuarios'>
            <option value=''>Participantes</option>
          </select>
        </div>
        <form id='chat'>
          <input type='text' id='texto_mensagem' name='texto_mensagem' />
          <input type='submit' value='Enviar mensagem!' />
        </form>
      </div>
    );
  };

  return (
    <div className='App'>
      {!isLoggedIn && <Login />}
      {isLoggedIn && <Chat />}
    </div>
  );
}

export default App;
