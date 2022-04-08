import express from 'express'
import { PORT, MONGODB } from './config';
import routes from './routes/index'
import error  from './middlewares/error'
import mongoose from 'mongoose';
import path from 'path';
const app = express();



 mongoose.connect( MONGODB,{ useNewUrlParser: true, useUnifiedTopology: true
    }).then(()=>{
        console.log('Connection Successful');
    }).catch((error)=>{     
        console.log('Something went wrong', error)
    });

    //mongoose connection doni
app.use(express.json())
app.use('/api',routes);
global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({ extended:false }))
app.use(error);
app.use('/uploads',express.static('uploads'));
app.listen(PORT,()=>{
    console.log(`Listening to port ${PORT} `)
})