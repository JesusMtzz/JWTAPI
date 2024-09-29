const express = require('express');
const { connectDB } = require('./config');
const userRoutes = require('./routes/routes');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
connectDB().catch(console.dir);

app.use(bodyParser.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`port ${PORT}`);
});