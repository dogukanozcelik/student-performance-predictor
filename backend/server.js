import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRouter from './routes/authRoutes.js';

const app = express();

app.use(cors())

app.use(express.json())

const PORT = process.env.PORT || 5001

app.get('/', (req,res) => {
  res.send('Server is Live')
})

app.use('/api/auth', authRouter)

app.listen(PORT, () =>{
    console.log('Server is running on Port:',PORT)
})
