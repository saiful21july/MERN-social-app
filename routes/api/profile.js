const express = require('express')
const router = express.Router()
// before every route i want to put three things
//@route and then request type which is GET and the endpoint which will be api/profile
// @ description what the router does. Test route.
//@access value whether it is public or private but in this case public.The public and private mean here that if you need token to access specific route let's say add a profile obviously you need to be authenticated so you need to send along token to that route in order to work otherwise you gonna get something called unauthorized access.

router.get('/', (req, res) => res.send('Profile route'))
module.exports = router
