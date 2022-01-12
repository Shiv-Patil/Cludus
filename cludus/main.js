const axios = require('axios');

axios.get(process.env.DASHBORD_URL)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
