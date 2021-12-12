const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const fs=require('fs');
var app = express();
require('dotenv').config();
const {auth,requiresAuth} = require('express-openid-connect');
//Configuring express server
app.use(
    bodyparser.json(),
    auth({
        authRequired:false,
        auth0Logout:true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
    })
);
var mysqlConnection = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true,
    insecureAuth : true
    });


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
var vulnerability= true;
var messages=[];
app.get('/',requiresAuth(),(req,res)=>{
    
    res.writeHead(200,{
        'Content-Type':'text/html'
        });
    fs.readFile('./index.html',null,function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Whoops! File not found!');
        } else {
            res.write(data);
        }
        res.end();
        });
    })
app.get('/users/:id' , (req, res) => {
    const id =req.params.id;
   if (vulnerability){
        mysqlConnection.query(`SELECT * FROM users WHERE idusers = ${id} `, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
    
   }else{
        mysqlConnection.query(`SELECT * FROM users WHERE idusers = ? `,id, (err, rows, fields) => {
            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
   }
  
    } 
);

app.get('/getVulnerability' , (req, res) => {
   
        res.send(vulnerability);
    } 
);

app.post('/setVulnerability' , (req, res) => {
    if(vulnerability){
        vulnerability=false;
    }else{
        vulnerability=true;
    }
    
    res.send(vulnerability);
} 
);
app.post('/MessageEntry/:message', (req, res) => {
    console.log("Message received:"+req.params.message)
    const message =req.params.message;
    messages.push(message);
    res.send(messages);
  });
  app.get('/MessageEntryGet/:message', (req, res) => {
    if(vulnerability){
        console.log("Message received:"+req.params.message)
        const message =req.params.message;
        messages.push(message);
        res.send(messages);
    }else{
        return res.status(400).send({
            message: 'This is an error!'
         });
    }
   
  });
app.get('/CSRFMessages/',(req,res) =>{
    res.send(messages);
})
