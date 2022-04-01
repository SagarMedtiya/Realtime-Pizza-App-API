import express from 'express'
import { PORT } from './config';
import routes from './routes/index'
import error  from './middlewares/error'
const app = express();

app.use(express.json())
app.use('/api',routes);

app.use(error);
app.listen(PORT,()=>{
    console.log(`Listening to port ${PORT} `)
})