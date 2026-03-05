const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));