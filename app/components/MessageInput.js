/* eslint-disable */
import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import TextareaAutosize from 'react-textarea-autosize';

const MessageInput = ({ recvRef, onSend }) => {
  const [text, setText] = useState('');

  const send = () => {
    if (onSend) {
      onSend(text);
    }
    setText('');
  };

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (text.trim() === '') return;
      send();
      e.preventDefault();
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        height: 'auto',
        display: 'flex',
        alignContent: 'flex-end'
      }}
    >
      <TextareaAutosize
        className="hide-scrollbar"
        style={{
          fontSize: '15px',
          border: '0',
          width: '100%',
          outline: 'none',
          borderRadius: '5px',
          padding: '12px',
          resize: 'none',
          lineHeight: '15px'
        }}
        autoFocus
        maxRows={5}
        placeholder="Input text"
        onHeightChange={() => {
          const ctRef = recvRef;
          ctRef.current.scrollTop = ctRef.current.scrollHeight;
        }}
        value={text}
        onChange={e => {
          setText(e.target.value);
        }}
        onKeyPress={onKeyDown}
      />
      <Button
        style={{
          color: '#fff',
          fontSize: '15px',
          border: '0',
          marginLeft: '20px',
          borderRadius: '5px',
          background: '#397FDF',
          outline: 'none',
          padding: '12px 25px',
          cursor: 'pointer',
          alignSelf: 'flex-end',
          lineHeight: '15px'
        }}
        onClick={() => send()}
      >
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
