// to create a model we need to create schema which just holds different fields we want this particular resource to have.First of all we need to bring mongoose.
const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})
module.exports = User = mongoose.model('user', UserSchema)
