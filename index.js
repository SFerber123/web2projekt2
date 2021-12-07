const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
//Configuring express server
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true,
    insecureAuth : true
    });

mysqlConnection.connect((err)=> {
    if(!err)
    console.log('Connection Established Successfully');
     else
    console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));


app.get('/learners/:id' , (req, res) => {
    const id =req.params.id;
    console.log(id)
    mysqlConnection.query(`SELECT * FROM users WHERE idusers = ${id} `, (err, rows, fields) => {
    if (!err)
    res.send(rows);
    else
    console.log(err);
    })
    } );