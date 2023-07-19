const express=require('express')
const db=require('./config/db')
const cors = require('cors');
const routes=require('./routes/route');
const bodyParser = require('body-parser');

const PORT=process.env.PORT||8000;


const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', routes);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})