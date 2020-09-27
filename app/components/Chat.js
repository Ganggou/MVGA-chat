/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { formatMessageTime } from '../utils';
import routes from '../constants/routes';
import MessageInput from './MessageInput';

const Chat = () => {
  const DDP = require('ddp');
  const login = require('ddp-login');
  const serverPort = 3000;
  const [ddpClient, setDdpClient] = useState();
  const history = useHistory();
  const [csData, setCsData] = useState(
    JSON.parse(
      localStorage.getItem('cs_data') || {
        base: '',
        authToken: '',
        subscribe: 'kYbWHanAo7hwDH7up',
        userId: ''
      }
    )
  );
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const ctRef = useRef();
  const useStyles = makeStyles({
    csMessage: {
      background: '#E6ECF5',
      color: '#000',
      borderTopRightRadius: '5px'
    },
    cMessage: {
      background: '#397FDF',
      color: '#fff',
      borderTopLeftRadius: '5px'
    },
    message: {
      fontSize: 15,
      fontWeight: 300,
      padding: '10px',
      margin: '6px 0',
      borderBottomLeftRadius: '5px',
      borderBottomRightRadius: '5px',
      display: 'inline-block',
      textAlign: 'left',
      maxWidth: '70%',
      whiteSpace: 'pre-line'
    },
    user: {
      fontSize: 12,
      fontWeight: 500,
      color: '#000',
      marginBottom: '4px'
    },
    box: {
      overflowY: 'scroll',
      flexGrow: 1,
      background: '#fff',
      padding: '0 10px'
    },
    input: {
      position: 'fix',
      bottom: 0,
      background: '#F0F4FA',
      marginTop: '30px',
      padding: '10px 20px',
      borderTop: '0.001em solid #b7b7b7'
    },
    time: {
      marginTop: '20px',
      textAlign: 'center'
    },
    loadingContainer: {
      zIndex: 999,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center'
    }
  });
  const classes = useStyles();

  const out = () => {
    setCsData({});
    history.push(routes.HOME);
  };

  const sendMessage = text => {
    if (text === '' || ddpClient === undefined || loading) {
      return;
    }
    const id =
      Math.random()
        .toString(36)
        .slice(-8) + new Date().getTime();
    console.info(id, csData.subscribe);
    ddpClient.call(
      'sendMessage',
      [
        {
          _id: id,
          rid: csData.subscribe,
          msg: text
        }
      ],
      function() {
        ddpClient.on('message', function(msg) {
          console.info(msg);
        });
      }
    );
  };

  const meesageTime = (msg, index) => {
    const { ts } = msg;
    if (index === 0 || ts - messages[index - 1].ts > 300000) {
      return <div className={classes.time}>{formatMessageTime(ts)}</div>;
    }
    return <div />;
  };

  useEffect(() => {
    const targetId = csData.userId;
    if (targetId === '') {
      return;
    }
    const storage = localStorage.getItem(`${targetId}_messages`);
    const messageHistory = JSON.parse(storage) || [];
    setMessages(messageHistory);
  }, [csData]);

  useEffect(() => {
    console.info(csData);
    if (csData.authToken === '') {
      return;
    }
    if (ddpClient !== undefined) {
      ddpClient.close();
    }
    process.env.METEOR_TOKEN = csData.authToken;
    const ddpClientTmp = new DDP({
      host: csData.base.replace(':3000', ''),
      port: serverPort,
      maintainCollections: true
    });
    setLoading(true);
    ddpClientTmp.connect(function(err) {
      if (err) throw err;

      login(
        ddpClientTmp,
        {
          env: 'METEOR_TOKEN',
          method: 'token',
          retry: 5
        },

        function(error) {
          if (error) {
            if (error === 403) {
              history.push(routes.CHAT);
            }
          } else {
            setLoading(false);
            ddpClientTmp.subscribe(
              'stream-room-messages',
              [csData.subscribe, false],
              function() {
                ddpClientTmp.on('message', function(msg) {
                  const data = JSON.parse(msg);
                  if (data.msg === 'changed') {
                    const arg = data.fields.args[0];
                    console.info(arg);
                    const message = {
                      id: arg._id,
                      user_id: arg.u._id,
                      ts: arg.ts.$date,
                      text: arg.msg,
                      name: arg.u.name
                    };
                    setMessages(messages => messages.concat(message));
                  }
                });
              }
            );
          }
        }
      );
    });
    setDdpClient(ddpClientTmp);
    return function close() {
      ddpClientTmp.close();
    };
  }, [csData]);

  useEffect(() => {
    const { userId } = csData;
    if (userId !== '' && userId !== null) {
      localStorage.setItem(`${userId}_messages`, JSON.stringify(messages));
    }
    if (ctRef.current !== undefined) {
      ctRef.current.scrollTop = ctRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (ctRef.current === undefined) {
      return;
    }
    ctRef.current.scrollTop = ctRef.current.scrollHeight;
  }, [ctRef.current]);

  return (
    <div>
      <div
        style={{
          height: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div onClick={() => out()}>back</div>
        <div ref={ctRef} className={`${classes.box} hide-scrollbar`}>
          {messages.map((msg, idx) => (
            <div key={msg.id}>
              {meesageTime(msg, idx)}
              <div
                style={
                  msg.user_id === csData.userId ? { textAlign: 'right' } : {}
                }
              >
                <div className={classes.user}>{msg.name}</div>
                <div
                  className={`${classes.message} ${
                    msg.user_id === csData.userId
                      ? classes.cMessage
                      : classes.csMessage
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={classes.input}>
          <MessageInput
            recvRef={ctRef}
            onSend={content => {
              sendMessage(content);
            }}
          />
        </div>
      </div>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress
            style={{
              width: '20px',
              height: '20px'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
