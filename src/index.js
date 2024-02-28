const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const routes = require('../src/routes/index')
require('dotenv').config()

const app = express()


const port = process.env.PORT || 8000
mongoose.connect(`${process.env.DB_URL}`)
    .then(() => {
        console.log('Connect Db success!')
    })
    .catch((err) => {
        // console.log(err)
    })

app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );
routes(app);
    
app.listen(port, () => {
    console.log('Server is running in port: ', + port)
})
