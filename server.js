// server.js
const express = require('express');
const { connectToDatabase } = require('./connection');
const passport = require('passport');
const path = require('path');
require('dotenv').config(); // Load environment variables
require('./passport'); // Ensure this file is correctly required
const authRoutes = require('./routes/auth'); // Adjust path as necessary
const purchaseRequestRoutes = require('./routes/purchaseRequests'); // Import purchase request routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for session management
app.use(require('express-session')({
    secret: process.env.SESSION_SECRET || 'fallback-secret', // Use a fallback secret for local development
    saveUninitialized: false, // Avoid uninitialized sessions
    resave: false // Avoid unnecessary resaves
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication routes
app.use('/auth', authRoutes);

// Purchase request routes
app.use('/purchase-requests', purchaseRequestRoutes); // Register the purchase request routes

// Sample route
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/welcome'); // Redirect to welcome page if authenticated
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html')); // Serve login page if not authenticated
    }
});

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // Specify the scopes you need
}));

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/login.html' // Redirect to login if authentication fails
    }),
    (req, res) => {
        // Successful authentication, redirect to the dashboard page
        res.redirect('/dashboard.html'); // Redirect to dashboard.html after successful login
    }
);

// Connect to MongoDB and start the server
connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to start the server:", err);
    });
