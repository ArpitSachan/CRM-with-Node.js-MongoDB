const mongoose= require('mongoose')
const validator= require('validator')

const historySchema= new mongoose.Schema({
  customerName:{
    type: String,
    reuqired:true
  },
  subject:{
    type: String,
    required: true,
  },
  time:{
    type: Date,
    reuqired: true,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer'
  }
})


const History= mongoose.model('History', historySchema)

module.exports= History
