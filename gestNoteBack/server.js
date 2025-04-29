const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MySqlPool = require('./config/bd')
require('dotenv').config()
/// GESTION ECOLE 

const admin = require('./router/AdminRoute/adminRoute')
const Student = require('./router/StudentRoute/StudentRoute')
const Teacher = require('./router/TeacherRoute/TeacherRoute')



app.use(express.json())
app.use(cors())

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));


app.use("/admin",admin)
app.use('/Student',Student)
app.use('/Teacher',Teacher)

const port = 7000
MySqlPool.query('SELECT 1').then(()=>{
    console.log("MYSQL DB Connected")
    app.listen(port,()=>{
        console.log(`Server listening ${port}`)
    })
}).catch((error)=>{
    console.log(error)
})