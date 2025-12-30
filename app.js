
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const app = express();

// --- CONFIGURATION ---
// Cloudinary Config (Hardcoded as requested)
cloudinary.config({
    cloud_name: 'dnb0q2s2h',
    api_key: '838368993294916',
    api_secret: 'N9U1eFJGKjJ-A8Eo4BTtSCl720c'
});

// MongoDB Connection
const mongoURI = "mongodb+srv://braynofficial66_db_user:Oh2ivMc2GGP0SbJF@cluster0.zi2ra3a.mongodb.net/website_db";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✔️ Connected to Cyber-Database"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// --- MIDDLEWARES ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'cyberpunk-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 Hours
}));

// Global Middleware for Admin Session
app.use((req, res, next) => {
    res.locals.admin = req.session.admin || null;
    res.locals.path = req.path;
    next();
});

// --- ROUTES ---
// Akan diisi di file berikutnya (routes/index.js & routes/admin.js)
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);

// Export for Vercel
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Source Code Hub Running on http://localhost:${PORT}`);
});
