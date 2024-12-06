let jwt = require('jsonwebtoken');
let statusCode = require('../utils/statusCode.js');
const db = require("../models/index.js");
const User = db.users;
let {Op}= require('sequelize')
let {encrypt} = require('./encryption.middlewares.js')
let {decrypt} = require('./decryption.middlewares.js')
const logger = require('../logger/index.logger.js')

function authenticateToken(req, res, next) {
  try {
    // console.log('new date', req.headers['authorization'])
    const authHeader = req.headers['authorization']; 
    const tokens = req.cookies;
    const sessionId = req.headers['sid']
    let statusId = 1;

    // console.log(authHeader,'authHeaders and tokens',req.headers)
    const token = tokens?.accessToken || authHeader?.replace('Bearer', '').trim();

    // console.log(token,'token')
    if (token == null) return res.status(statusCode.UNAUTHORIZED.code).json({ error: "Null token" });

    if (!token) {
      return res.status(statusCode.UNAUTHORIZED.code).json({ error: "Access token not found" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      // console.log(user);
      if (error) return res.status(statusCode.UNAUTHORIZED.code).json({ error: error.message });
      console.log(user,'user auth token ')
      const findUser = await User.findByPk(user.userId);
      // console.log(findUser,'findUser')
      // // console.log(query.rows);
      if (findUser.statusId == 2) {
        return res.status(statusCode.UNAUTHORIZED.code).json({ message: 'You are inactive user' });
      } else {
        req.user = findUser;
        req.session = sessionId;
        next();
      }
    });
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`); // Log the error

    return res.status(statusCode.UNAUTHORIZED.code).json({ message: err.message });
  }
}


module.exports = authenticateToken;