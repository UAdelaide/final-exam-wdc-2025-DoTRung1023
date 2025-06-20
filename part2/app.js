const express = require('express');
const path = require('path');
const session = require('express-session');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Session middleware
app.use(session({
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60*60*1000 // 1 hour
    }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
