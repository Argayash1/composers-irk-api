import express from 'express';
import mongoose from 'mongoose';

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/irkcomposersdb', {});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
