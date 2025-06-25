import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import router from '../src/routes/index.js';
import '../src/jobs/updateMissedAdherence.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('✅ API Working from Vercel');
});

export const handler = serverless(app);
