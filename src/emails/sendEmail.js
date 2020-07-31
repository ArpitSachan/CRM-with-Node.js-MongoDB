const nodemailer= require('nodemailer')
const logger= require('../../config/logger')

const sendEmail = async (args) =>{
  try{
    const transporter= nodemailer.createTransport({
      service: 'gmail',
      auth:{
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
      }
    })
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: args.email,
      subject: args.subject,
      html: args.body
    })
    logger.info('Message sent');
  }catch(e){
    logger.error('cannot send email', e);
  }
}

module.exports={
  sendEmail
}
