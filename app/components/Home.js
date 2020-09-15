import React, { useState, Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import { getAccess, connectRock } from '../http/self';

const Home = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const connect = () => {
    getAccess(url)
      .then(body => {
        console.info(body.access_token);
        if (body.access_token) {
          connectRock(body.access_token, name)
            .then(connectBody => console.info(connectBody))
            .catch();
        }
        return null;
      })
      .catch();
  };

  return (
    <div className={styles.container} data-tid="container">
      <h2>MVGA Chat</h2>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="url"
        />
        <input
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="name"
          onKeyPress={e => {
            if (e.key === 'Enter') {
              connect();
            }
          }}
        />
      </div>
    </div>
  );
};

export default Home

