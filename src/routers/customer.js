const express= require('express')
const Customer= require('../models/customer')
const History= require('../models/history')
const router= new express.Router()
const auth = require('../middleware/auth')
const kue = require("../kue/kue");
require('../kue/worker')
const logger= require('../../config/logger')

router.get('/private', auth, async (req, res)=>{
  const customers = await Customer.find({owner: req.user._id})
    res.render('private', {customers})
})

router.get('/customerInfo', auth, (req, res)=>{
  res.render('customerInfo')
})
router.get('/updateInfo/:id', auth, async (req, res)=>{
  const customer= await Customer.findOne({_id:req.params.id})
  res.render('updateInfo', {
    customer
  })
})
router.get('/email/:id', auth, async (req, res)=>{
  const customer= await Customer.findOne({_id:req.params.id})
  res.render('email', {
    customer
  })
})
router.get('/history/:id', auth, async(req, res)=>{

  const customer= await Customer.findOne({_id: req.params.id})

  try{
  await customer.populate('history').execPopulate()
  const conversationHistory=customer.history
  res.render('history', {
    conversationHistory})
  }catch(e){
    logger.error('Can not load history', e)
    res.status(500).send(e)
  }
})
router.post('/email/:id', auth, async(req, res)=>{
  const customer= await Customer.findOne({_id:req.params.id, owner: req.user._id})
  if(!customer){
    logger.info('customer not found')
    return res.status(404).send('Customer not found')
  }
  const history = new History({
    customerName: customer.name,
    subject: req.body.subject,
    time: Date.now(),
    user: customer._id
  })
  try{
    await history.save()
    kue.scheduleJob({
      jobName: 'sendEmail',
      time: 1000,
      params:{
        email: customer.email,
        subject: req.body.subject,
        body: req.body.message
      }
    })
   kue.scheduleJob({
    jobName: 'sendEmail',
    time: customer.freq*60*1000,
    params: {
      email: customer.email,
      subject: "Reminder",
      body:req.body.subject
    }
  })
  res.redirect('/private')
}catch(e){
  logger.error('Error!', e)
  res.status(400).send({e:'Error!' })
}
})
router.post('/updateInfo/:id', auth, async (req, res)=>{
  const updates= Object.keys(req.body)
  console.log(req.body);
  const allowed = ['name', 'email', 'phone', 'address', 'gst', 'freq']
  const isValid = updates.every((update)=>{
    return allowed.includes(update)
  })
  if(!isValid){
    logger.error('Invalid uodates', error)
    return res.status(400).send({error: 'Invalid updates'})
  }
  try{
    const customer= await Customer.findOne({_id:req.params.id, owner: req.user._id})
    if(!customer){
      logger.error('customer not found')
      return res.status(404).send('customer not found')
    }

    updates.forEach((update)=>customer[update]=req.body[update])
    await customer.save()

    res.redirect('/private')
  }catch(e){
    res.satus(500).send(e)
  }
})

router.post('/customerInfo', auth, async(req, res)=>{
  const customer = new Customer({
    ...req.body,
    owner: req.user._id
  })
  try{
    await customer.save()
    res.redirect('/private')
  }catch(e){
    logger.error('cannot update customer details', e)
    res.status(400).send(e)
  }
})

router.post('/delete/:id', auth, async(req, res)=>{
  try{
    const customer= await Customer.findById({_id:req.params.id})
    if(!customer){
      logger.error('customer not found')
      res.send(404).send()
    }
    await customer.remove()
    res.redirect('/private')
  }catch(e){
    logger.error('Something messed up!', e)
    res.status(500).send(e)
  }
})


module.exports = router
