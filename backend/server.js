import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import modelRouter from './routes/modelController.js'

const app = express();

app.use(cors())

app.use(express.json())

const PORT = process.env.PORT || 5001

app.get('/', (req,res) => {
  res.send('Server is Live')
})

app.use('/api/model', modelRouter)


app.listen(PORT, () =>{
    console.log('Server is running on Port:',PORT)
})