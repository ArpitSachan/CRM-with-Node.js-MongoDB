const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const crypto=require('crypto')


const tokenSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  token:{
    type: String,
    required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now,
    expires: '2m'
  },
})


const Token= mongoose.model('Token', tokenSchema)

module.exports= Token
