const nodemailer = require("nodemailer")
const logger= require('../../config/logger')

const transporter= nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS
  }
})


const sendVerificationEmail=(email, header, token)=>{
transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'CRM Email verification',
    text: `${token}`
  }).then(()=>{
    logger.info('Message sent!');
  }).catch((e)=>{
    logger.error('Error!');
  })
}

module.exports= {
  sendVerificationEmail
}
