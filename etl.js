const axios = require('axios');



(async () => {
  try {
    const  req1  = await axios.post('http://localhost:4000/auth/register', {
      login: 'sergey',
      password: '6324ab',
    });
    console.log(req1.data);

    const req2 = await axios.post('http://localhost:4000/auth/login', {
      login: 'sergey',
      password: '6324ab',
    });
    console.log(req2.data);

    const { token } = req2.data;
    const req3 = await axios.get('http://localhost:4000/user', {
      headers: { authorization: `Token ${token}` },
    });

    console.log(req3.data);
  } catch (err) {
    console.log(err.response.data);
  }
})();
