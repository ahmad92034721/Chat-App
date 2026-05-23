const dotenv = require('dotenv');
dotenv.config({path: './.env'})

const dbConfig = require('./config/dbConfig');
const server = require('./app');
const port = process.env.PORT_NUMBER;

server.listen(port, () => {
  console.log("Server running on port:", port);
})