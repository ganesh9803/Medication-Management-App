import express from 'express';
import serverless from 'serverless-http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

import router from '../src/routes/index.js';
import '../src/jobs/updateMissedAdherence.js';

app.get('/', (req, res) => res.send('API Working on Vercel'));
app.use('/api', router);

export const handler = serverless(app);
