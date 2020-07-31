const express = require('express')
const path = require('path')
const hbs=require('hbs')
const User=require('./models/user')
const Customer= require('./models/customer')
require('./database/mongoose')
const cookieParser = require('cookie-parser')
const bodyParser=require('body-parser')
const userRouter = require('./routers/user')
const customerRouter = require('./routers/customer')
const logger= require('../config/logger')

const app = express()
const port = process.env.PORT

const publicDirectoryPath = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, 'templates/partials');
const viewsPath = path.join(__dirname, 'templates/views');



app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(userRouter)
app.use(customerRouter)


app.listen(port, ()=>{
  logger.info('Server started...' + port);
})
