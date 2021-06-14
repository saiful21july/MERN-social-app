const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
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
module.exports = router
