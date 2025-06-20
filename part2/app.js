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
    secret: process.env.SESSION_SECRET || 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Using HTTP
        maxAge: 60*60*1000 // 1 hour
    }
}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const dogsRouter = require('./routes/dogsRoutes');

app.use('/api', dogsRouter);
app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/owners', ownerRoutes);

// Export the app instead of listening here
module.exports = app;
