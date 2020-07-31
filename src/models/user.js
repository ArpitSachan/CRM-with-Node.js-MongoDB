const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')


const userSchema= new mongoose.Schema( {
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
  password:{
    type: String,
    required: true,
    trim: true,
    validate(value){
      if(value.toLowerCase().includes('password')){
        logger.error('password cannot be password');
        throw new Error('please enter a strong password')
      }
    }
  },
  tokens:[{
    token:{
      type: String,
      required: true
    }
  }],
  isVerified:{
    type: Boolean,
    default: false
  }
})

userSchema.virtual('customers', {
  ref: 'Customer',
  localField: '_id',
  foreignField: 'owner'
})
userSchema.methods.generateAuthToken= async function(){
  const user= this
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '7 days'})

  user.tokens= user.tokens.concat({token})
  await user.save()
  return token

}

userSchema.statics.findByCredentials= async(email, password)=>{
  const user= await User.findOne({email})

  if(!user){
    throw new Error('Unable to login')
  }

  const isMatch= await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error('Unable to login')
  }
  if(!user.isVerified){
    logger.error('Token password is wrong');
    throw new Error('Wrong token password!')
  }

  return user
}

// hashing password
userSchema.pre('save', async function(next){
  const user=this
  if(user.isModified('password')){
    user.password= await bcrypt.hash(user.password, 8)
  }
  next()
})
const User = mongoose.model('User', userSchema)

module.exports= User
