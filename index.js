import express,{ json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import  'dotenv/config';
import userRoute from './routes/user.route.js';
import userMessage from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import { io, server,app} from './SocketIO/server.js';

const PORT = process.env.PORT || 3000;
const MONGO_URI= process.env.MONGO_URI;

// const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Yahan tumhare frontend ka URL hona chahiye
    credentials: true,
}));

app.use(json());
app.use(cookieParser());


mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);       
})

app.use('/api/user', userRoute);
app.use('/api/message', userMessage);

app.get('/', (req, res) => {
  res.send('Welcome to the Chat App Backend');
});

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});