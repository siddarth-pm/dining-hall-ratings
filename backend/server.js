// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://siddarthm272:EfBxfaUEqvsIP8ly@cluster0-test.u2ruenk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

// Define the rating schema
const ratingSchema = new mongoose.Schema({
  diningHallId: Number,
  rating: Number,
  review: String,
  timestamp: { type: Date, default: Date.now },
});

// Create the rating model
const Rating = mongoose.model('Rating', ratingSchema);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Delete entries at given times
cron.schedule('30 11 * * *', async () => {
  try {
    await Rating.deleteMany({});
    console.log('All ratings deleted at 11:30 AM PST');
  } catch (error) {
    console.error('Error deleting ratings:', error);
  }
}, {
  scheduled: true,
  timezone: 'America/Los_Angeles'
});

cron.schedule('0 17 * * *', async () => {
  try {
    await Rating.deleteMany({});
    console.log('All ratings deleted at 5:00 PM PST');
  } catch (error) {
    console.error('Error deleting ratings:', error);
  }
}, {
  scheduled: true,
  timezone: 'America/Los_Angeles'
});

// API endpoints
app.post('/api/ratings', async (req, res) => {
  const { diningHallId, rating, review } = req.body;

  try {
    const newRating = new Rating({ diningHallId, rating, review });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/ratings/:diningHallId', async (req, res) => {
  const { diningHallId } = req.params;

  try {
    const ratings = await Rating.find({ diningHallId: parseInt(diningHallId) });
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/ratings', async (req, res) => {
  try {
    await Rating.deleteMany({});
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ...

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});