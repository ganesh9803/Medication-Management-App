//server.js
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // serve static files

import router from './routes/index.js';
import './jobs/updateMissedAdherence.js';

app.use('/api', router);

const PORT = process.env.PORT || 5000;

// Error handling middleware
app.get('/',(req,res)=> {
  res.send("API Working")
})

app.listen(PORT , ()=>console.log('Sever started on PORT : ' + PORT ))

export default app;