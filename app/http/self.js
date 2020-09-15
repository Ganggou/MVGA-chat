export const getAccess = url => {
  return fetch(`http://${url}/access`)
    .then(res => res.json())
    .catch();
};

export const connectRock = (token, name) => {
  const headers = {
    Authorization: token,
    'Content-Type': 'application/json'
  };

  return fetch(`https://api.chatsdk.io/rockets/connect`, {
    method: 'POST',
    headers,
    mode: 'cors',
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .catch();
};
