const mongoose = require('mongoose');
require('dotenv').config()

function newConnection(uri){
    const conn = mongoose.connect(uri , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connect(`${process.env.URI_MONGODB_APP}`)
    .then(() => {
        console.log('Connect Db success!')
    })
    .catch((err) => {
        // console.log(err)
    })

    return conn
}

//make connection to DB test

const testConnection = newConnection(process.env.URI_MONGODB_TEST);
const UserConnection = newConnection(process.env.URI_MONGODB_USERS);

module.exports = {
    testConnection,
    UserConnection
}