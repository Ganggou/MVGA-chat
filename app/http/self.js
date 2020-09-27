const headers = {
  'Content-Type': 'application/json'
};

export const login = (url, name) => {
  return fetch(`http://${url}/api/v1/login`, {
    method: 'POST',
    headers,
    mode: 'cors',
    body: JSON.stringify({
      user: name,
      password: '123aaa'
    })
  }).then(res => res.json());
};

export const register = (url, username) => {
  return fetch(`http://${url}/api/v1/users.register`, {
    method: 'POST',
    headers,
    mode: 'cors',
    body: JSON.stringify({
      username,
      email: `${Math.random()
        .toString(36)
        .slice(-8)}@ruilisi.co`,
      pass: '123aaa',
      name: username
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success || data.error === 'Username is already in use') {
        return login(url, username);
      }
      alert(data.error);

      return data;
    });
};
