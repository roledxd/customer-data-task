const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'customerinfo'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/submit', (req, res) => {
  const { name, email, phone } = req.body;
  const customer = { name, email, phone };

  connection.query('INSERT INTO customers SET ?', customer, (err, result) => {
    if (err) {
      console.error('Error inserting customer: ' + err.stack);
      res.send('Error inserting customer');
      return;
    }
    console.log('Customer inserted with ID ' + result.insertId);
    res.send('Customer inserted successfully');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});