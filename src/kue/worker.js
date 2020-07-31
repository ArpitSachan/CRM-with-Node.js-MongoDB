
const kue= require('kue')
const Queue= kue.createQueue()
const {sendEmail}= require('../emails/sendEmail')

Queue.process('sendEmail', async (job, done)=>{
  const {data}= job
  await sendEmail(data)
  done()
})
