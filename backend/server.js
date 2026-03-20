import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import modelRouter from './routes/modelController.js'
import authRouter from './routes/authRoutes.js'
import instructorRouter from './routes/instructorRoutes.js'
import studentRouter from './routes/studentRoutes.js'


const app = express();

app.use(cors())

app.use(express.json())

const PORT = process.env.PORT || 5001

app.get('/', (req,res) => {
  res.send('Server is Live')
})

app.use('/api/model', modelRouter);
app.use('/api/auth', authRouter)
app.use('/api/instructors', instructorRouter)
app.use('/api/students', studentRouter)


app.listen(PORT, () =>{
    console.log('Server is running on Port:',PORT)
})
