const express = require('express')
const router= new express.Router()
const User=require('../models/user')
const Token=require('../models/token')
const Customer=require('../models/customer')
const auth= require('../middleware/auth')
const crypto= require('crypto')
const {sendVerificationEmail} = require('../emails/account')
const logger= require('../../config/logger')


router.get('', (req, res)=>{
  res.render('home')
})
router.get('/users', (req, res)=>{
  res.render('register')
})
router.get('/users/login', (req, res)=>{
  res.render('login')
})
router.get('/users/verification', (req, res)=>{
  res.render('verification')
})

router.post('/users', async (req, res)=>{
  const user = new User(req.body)

  try{
    await user.save()
    const token =await user.generateAuthToken()

    const verificationtoken = new Token({
      userId: user._id,
      token:  crypto.randomBytes(2).toString('hex')
    })
    try{
      await verificationtoken.save()
      sendVerificationEmail(user.email, req.headers.host, verificationtoken.token)
    }catch(e){
      logger.error(e)
    }
    res.cookie('auth_token', token)
    res.redirect('/users/verification')

  }catch(e){
    logger.error(e)
    res.status(400).send(e)
  }
})

router.post('/users/login', async (req, res)=>{
  try{
    const user= await User.findByCredentials(req.body.email, req.body.password)
    const token =await user.generateAuthToken()
    res.cookie('auth_token', token)
    res.redirect('/private')
  }catch(e){
    logger.error('Please register', e);
    res.redirect('/users/login')
  }
})
router.post('/users/verification',auth, async(req, res)=>{

  const token = await Token.findOne({userId: req.user._id, token: req.body.token})
    console.log(req.user.isVerified);
  if(!token){
    logger.error('Unable to login')
    throw new Error('Unable to login')
  }
  req.user.isVerified=true
  try{
  await req.user.save()
  res.redirect('/private')
}catch(e){
  logger.error('Can not verify', e)
  res.status(500).send(e)
}
})

router.get('/users/logout', auth, async(req, res)=>{
  try{
    req.user.tokens=req.user.tokens.filter((token)=>{
      return token.token!==req.token
    })
    await req.user.save()
    // res.clearCookie('auth_token')
    res.redirect('/users/login')
  }catch(e){
    logger.error('Can not logout', e)
    res.status(500).send(e)
  }
})

router.get('/users/logoutAll', auth, async (req, res)=>{
  try{
    req.user.tokens=[]
    await req.user.save()

    res.redirect('/users/login')
  }catch(e){
    logger.error('Can not logout', e)
    res.status(500).send(e)
  }
})


module.exports= router
