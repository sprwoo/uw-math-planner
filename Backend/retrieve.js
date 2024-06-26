require('dotenv').config();
const { Client } = require('pg');

// Create a connection to the database
const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432,
});

client.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });