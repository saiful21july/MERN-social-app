const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const config = require('config')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
// before every route i want to put three things
//@route and then request type which is GET and the endpoint which will be api/users
// @ description what the router does. Test route.
//@access value whether it is public or private but in this case public.The public and private mean here that if you need token to access specific route let's say add a profile obviously you need to be authenticated so you need to send along token to that route in order to work otherwise you gonna get something called unauthorized access.

// Now we are going to work on register route which is going to be post request.
//router.get('/', (req, res) => res.send('User route'))

// we set the validation.
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(), // we can check all the rules in documentation.
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // now to handle the response we have to go within here within the actual body.
    //console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body
    try {
      // see if user exist
      let user = await User.findOne({ email })
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }
      // Get users gravatar. It is going to run if the user not found.
      // first thing we need to do before we encrypt it.we need to create salt to do the hashing with.
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      })
      user = new User({
        name,
        email,
        avatar,
        password,
      })
      // Encrypt password using bcrypt.
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()

      // Return jsonwebtoken

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
