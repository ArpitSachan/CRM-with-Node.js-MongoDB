const mongoose= require('mongoose')
const validator= require('validator')
const History=require('./history')
const logger= require('../../config/logger')

const customerSchema= new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
  },
  email:{
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        logger.error('Invalid Email Id');
        throw new Error('Please enter a valid Email')
      }
    }
  },
  phone:{
    type: Number,
    unique: true,
    required: true,
    trim: true,
  },
  address:{
    type: String,
    unique: true,
    required: true,
  },
  gst: {
    type: String,
    unique: true,
    required: true,
  },
  freq:{
    type: Number,
    required: true,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
},{
  timestamps: true
})

customerSchema.virtual('history', {
  ref: 'History',
  localField: '_id',
  foreignField: 'user'
})

customerSchema.pre('remove', async function(next){
  const customer= this
  await History.deleteMany({user: customer._id})
  next()
})
const Customer= mongoose.model('Customer', customerSchema)

module.exports= Customer
