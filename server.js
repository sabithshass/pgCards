require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConnection');
const authRoutes = require('./src/routes/authRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/user', authRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
