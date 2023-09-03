const mysql= require('mysql2');
require('dotenv').config();

//connecting to mysql database
const db= mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.db_password,
        database: 'business_employees_db' 
})

module.exports=db;