import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import UserRoute from './routes/user.route.js';
import ConversationRoute from './routes/conversation.route.js';
import MessageRoute from './routes/message.route.js';
import GigRoute from './routes/gig.route.js';
import ReviewRoute from './routes/review.route.js';
import OrderRoute from './routes/order.route.js';
import AuthRoute from './routes/auth.route.js';

const app = express();
const PORT = 8800;
dotenv.config();

mongoose.set('strictQuery', true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('connected to mongo database!');
  } catch (error) {
    console.log(error);
  }
};

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

app.use('/api/users', UserRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/messages', MessageRoute);
app.use('/api/orders', OrderRoute);
app.use('/api/gigs', GigRoute);
app.use('/api/reviews', ReviewRoute);
app.use('/api/conversations', ConversationRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong';

  return res.status(errorStatus).send(errorMessage);
});

app.listen(PORT, () => {
  connect();
  console.log(`Server is running at http://localhost:${PORT}!!`);
});
