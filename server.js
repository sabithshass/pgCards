// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }
require('dotenv').config();


const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConnection'); 
const authRoutes = require('./src/routes/authRoutes');
const uploadRoutes = require("./src/routes/uploadRoutes");
const cardRoutes = require("./src/routes/cardRoutes");
const userProfileRoutes = require("./src/routes/userProfileRoutes");
const cartRoutes =require("./src/routes/cartRoutes")
const paymentRoutes=require("./src/routes/paymentRoutes")
const { deleteExpiredTrialUsers } = require("./src/controller/deleteExpiredTrialUsers")

const app = express();


// app.use(cors());
app.use(cors({
  origin: '*'
}));

app.use(express.json());

connectDB();

app.use("/uploads", express.static("uploads"));


app.use('/user', authRoutes);
app.use("/upload", uploadRoutes);
app.use("/card", cardRoutes);
app.use("/userProfile",userProfileRoutes)
app.use("/cart",cartRoutes)
app.use("/payment",paymentRoutes)

app.get("/api/cron/delete-expired-trials", deleteExpiredTrialUsers);

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
