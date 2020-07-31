
const kue= require('kue')
const Queue= kue.createQueue()

const scheduleJob= (data)=>{
  Queue.createJob(data.jobName, data.params)
  .attempts(3)
  .delay(data.time)
  .save()
}

module.exports= {
  scheduleJob
}
