let jwt = require('jsonwebtoken');

//Generate an access token and a refresh token for this database user
async function jwtTokens(userId, userName) {
  try {
    console.log(userId, userName, 'token data')

    const user = { userId, userName };
    console.log(userId, userName);

    let accessToken;
    let refreshToken;

    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30day' });
    refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30day' });
    return ({ accessToken, refreshToken });
  }
  catch (err) {
    return {
      error: "Internal Server Error"
    }
  }
}

module.exports = jwtTokens;