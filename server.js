const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
//setting up express application
const app = express();

//express middleware(extra functionality) setting up express to handle those types of data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connecting to mysql database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'business_employees_db'
  },
  console.log(`Connected to the business_employees_db database.`)
);

//mysql query
//counts the number of instock from favorite books the out of stock
db.query('SELECT in_stock COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, results) {
  console.log(results);
});

//gives the sum quantity,  the max quanity and min quantity and the average quanity per section.  This is done in the order listed
db.query('SELECT section, SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, results) {
  console.log(results);
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
