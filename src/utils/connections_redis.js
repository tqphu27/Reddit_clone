const redis = require('redis')
const client = redis.createClient({
    port: '6379',
    host: '127.0.0.1'
})

client.ping( (err, pong) => {
    console.log(pong)
})

client.on("error", function(error) {
    console.error(error)
})

client.on("connect", function(error) {
    console.error('connected')
})

client.on("ready", function(error) {
    console.error('Redis to ready')
})

module.exports = client;