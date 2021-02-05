const axios = require('axios');

async function getUser() {
    try {
      const response = await axios.get('localhost:9000/subjects');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }