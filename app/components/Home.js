import React, { useState } from 'react';
import { useHistory } from 'react-router';
import routes from '../constants/routes';
import styles from './Home.css';
import { register } from '../http/self';

const Home = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const history = useHistory();

  const create = () => {
    register(url, name)
      .then(data => {
        console.info(data);
        if (data.status === 'success') {
          console.info(data.status);
          localStorage.setItem(
            'cs_data',
            JSON.stringify({
              base: url,
              authToken: data.data.authToken,
              userId: data.data.userId,
              subscribe: 'GENERAL'
            })
          );
          history.push(routes.CHAT);
        } else {
          alert(JSON.stringify(data));
        }
        return data;
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
              create();
            }
          }}
        />
      </div>
    </div>
  );
};

export default Home;
