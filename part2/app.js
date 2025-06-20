const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // 
        maxAge: 60*60*1000 // 1 hour
    }
}));

// Export the app instead of listening here
module.exports = app;