const express = require('express')
const {app} = require('./app')
const path = require('path')
let port = process.env.PORT || 8000;

require('dotenv').config({path: path.resolve(__dirname, '../../.env') })


// console.log(path.resolve(__dirname, '../../.env'))

require('./models')


app.listen(port, (err) =>{
    if(err) throw err;
    console.log(`server is listening on port ${port}`)
})