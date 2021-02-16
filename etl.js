const axios = require('axios');

(async () => {
  try {
    const { data: res1 } = await axios.post('http://localhost:3001/auth/register', {
      login: 'sergey',
      password: '6324ab',
    });
    console.log(res1);

    const { data } = await axios.post('http://localhost:3001/auth/login', {
      login: 'sergey',
      password: '6324ab',
    });
    console.log(data);

    const { token } = data;
    const { data: res2 } = await axios.get('http://localhost:3001/auth/check', {
      headers: { authorization: `Token ${token}` },
    });

    console.log(res2);
  } catch (err) {
    console.log(err);
  }
})();
