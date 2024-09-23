import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router';

dotenv.config();


const app = express();

app.use(cors({
    credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

const server = http.createServer(app);

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});

const DataBaseUrl = process.env.DATABASE_URL 

mongoose.Promise = Promise;
mongoose.connect(DataBaseUrl)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err: Error) => {
    console.error('Error connecting to database:', err);
  });


app.use('/', router());

