if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConnection'); 
const authRoutes = require('./src/routes/authRoutes');

const app = express();


app.use(cors());
app.use(express.json());

connectDB();


app.use('/user', authRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
