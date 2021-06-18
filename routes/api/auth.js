const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')
const User = require('../../models/User')
const config = require('config')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

// before every route i want to put three things
//@route and then request type which is GET and the endpoint which will be api/auth
// @ description what the router does. Test route.
//@access value whether it is public or private but in this case public.The public and private mean here that if you need token to access specific route let's say add a profile obviously you need to be authenticated so you need to send along token to that route in order to work otherwise you gonna get something called unauthorized access.

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})
// @route  POST api/auth
// @desc   Authenticate user & get token
//@access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'password is required').exists(),
  ],
  async (req, res) => {
    // now to handle the response we have to go within here within the actual body.
    //console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    try {
      // see if user exist
      let user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }
      // bcrypt has a method called compare which takes plain text password and encrypted password and compare them and tell you it is match or not.

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }
      const payload = {
        user: {
          id: user.id,
        },
      }
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
      // just the reiterate we go through create the user, hash the password, save the user in the database,get the payload which includes the user id and then we sign the token, passing the payload, passing the secret,expiration which is optional,and then inside the callback we either get an error or we get the token. if we get the token or do not get an error then we are going to send token back to the client.
      //res.send('User registered')
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)
module.exports = router
