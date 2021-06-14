const jwt = require('jsonwebtoken')
const config = require('config')
const { response } = require('express')
// what we did here is that we are exporting middleware function that has req and res object available to it  and then we are getting the token from header using req.header, and we are looking at x-auth-token that's we need to send it in . if there is no token at all, and the route is protected in using this middleware then it is going to send 401 denied msg.If there is a token but it is not valid then it is going to run this catch which will just say token is not valid , if it is valid then it is going to decoded through jwt verify which we put that inside variable decoded object which then we want to set req.user to the user that's in that decoded token. then we can use that req.user in any of our routes or any of our protected routes. for instance we can get the user's profile.
// Now we want to implement this into protected route.Now we are going to start working in our routes/api/auth file.
module.exports = function (req, res, next) {
  // get the token from header.
  const token = req.header('x-auth-token')
  // check if there is no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' })
  }
  // verify if there is one
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
