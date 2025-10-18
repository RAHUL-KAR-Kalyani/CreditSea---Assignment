// Express app (exported so tests can import it)
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const uploadRouter = require('./routes/upload');
const reportsRouter = require('./routes/reports');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: "https://creditsea-assignment-adno.onrender.com",
    credentials: true
}));

app.use('/api', uploadRouter);
app.use('/api', reportsRouter);

// Basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
