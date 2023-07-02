const connectToMySql = require('./db');
const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use('/auth', require('./routes/auth'));
app.use('/uploads', express.static('uploads'));

connectToMySql()
  .then(() => {
    app.get('/', (req, res) => {
      res.send('Node.js app is running on port ' + port);
    });

    app.listen(port, () => {
      console.log('webOconnect Backend listening at Port:3000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database', err);
  });
