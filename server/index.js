const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const { Assembly } = require('assemblyai');

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();
console.log(process.env.ATLAS_URI);


const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;


mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
  