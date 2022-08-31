require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));