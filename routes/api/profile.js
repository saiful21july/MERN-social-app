const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const { ContextBuilder } = require('express-validator/src/context-builder')
// before every route i want to put three things
//@route and then request type which is GET and the endpoint which will be api/profile
// @ description what the router does. Test route.
//@access value whether it is public or private but in this case public.The public and private mean here that if you need token to access specific route let's say add a profile obviously you need to be authenticated so you need to send along token to that route in order to work otherwise you gonna get something called unauthorized access.

// After creating model we want to do
// @route GET api/profile // get current users profile
// it is going to be private.
// First of all we want to create a route to get to our profile.

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    )
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})
// @route POST api/profile
// @desc    create or update user profile
// @access  private
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body
    // build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }
    // build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      let profile = await Profile.findOne({ user: req.user.id })
      if (profile) {
        // update if found profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        return res.json(profile)
      }
      // if profile not found then create a new one
      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)
// @route GET api/profile
// @desc  GET all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})
// @route GET api/profile/user/:user_id
// @desc  GET profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])
    if (!profile) return res.status(400).json({ msg: 'Profile not found' })
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error')
  }
})
module.exports = router
// Now let's reiterate what's going on here on this file is that we check for the errors, body errors and pull everything from the body and then we build up this profileFields object to insert into database and we need to check to see if the stuffs actually coming in before we set it and then we need to initialize social object and do the same for profile.social like profile.user.Then we are going to go ahead look for profile by the user if it is found then we will update it and send back the profile, if it is not found we are just going to create it, save it and send back the profile
