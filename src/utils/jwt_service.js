const JWT = require("jsonwebtoken");
const createError = require('http-errors')
const client = require('../utils/connections_redis')

require('dotenv').config()

const signAcessToken = async (userId) => {
    return new Promise( (resolve, reject) => {
        const payload = {
            userId
        }

        const secret = process.env.JWT_KEY

        const options = {
            expiresIn: '1h'
        }

        JWT.sign(payload, secret, options, (err, token) => {
            if(err) reject(token)
            resolve(token)
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    if(!req.headers['token']){
        return next(createError.Unauthorized)
    }
    
    const authHeader = req.headers['token']
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1]

    JWT.verify(token, process.env.JWT_KEY, (err, payload) => {
        if(err){
            if(err.name === 'JsonWebTokenError'){
                return res.status(401).json({ message: 'Unauthorized' });
            }
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.payload = payload;
        next();
    })
}

const signRefreshToken = async (userId) => {
    return new Promise( (resolve, reject) => {
        const payload = {
            userId
        }

        const secret = process.env.JWT_REFRESH_KEY;

        const options = {
            expiresIn: '1y'
        }

        JWT.sign(payload, secret, options, (err, token) => {
            if(err) reject(token)
            client.set(userId.toString(), token, 'EX', 365*24*60*60, (err, reply) => {
                if(err){
                    return reject(createError.InternalServerError());
                }
                resolve(token)
            })
        })
    })
}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise( (resolve, reject) => {
        JWT.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, payload) => {
            if(err){
                return reject(err);
            }
            client.get(payload.userId, (err, reply) => {
                if(err){
                    return reject (createError.InternalServerError());
                }
                if(refreshToken === reply){
                    return resolve(payload);
                }
                return reject(createError.Unauthorized());
            })
        })

    } )
}

const verifyTokenAndUserAuthorization = async (req, res, next) => {
    verifyAccessToken(req, res, () => {
      if (req.user.id === req.params.id.trim() || req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json("You're not allowed to do that!");
      }
    });
}

module.exports = {
    signAcessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyTokenAndUserAuthorization
}