
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Import Models (Pastikan file-file ini sudah kamu buat di folder /models)
const Admin = require('./models/Admin');
const Project = require('./models/Project');

const app = express();

// ==========================================
// 1. CONFIGURATION (HARDCODED)
// ==========================================

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dnb0q2s2h',
    api_key: '838368993294916',
    api_secret: 'N9U1eFJGKjJ-A8Eo4BTtSCl720c'
});

// MongoDB Connection
const mongoURI = "mongodb+srv://braynofficial66_db_user:Oh2ivMc2GGP0SbJF@cluster0.zi2ra3a.mongodb.net/website_db";
mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log("✔️ Cyber-Database Connected");
    seedLegends(); // Jalankan inisialisasi akun Admin/Owner
})
.catch(err => console.log("❌ DB Error:", err));

// ==========================================
// 2. MIDDLEWARES & VIEW ENGINE
// ==========================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'cyber-source-key-2024',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 Jam
}));

// Global Variables untuk Template EJS
app.use((req, res, next) => {
    res.locals.admin = req.session.admin || null;
    res.locals.path = req.path;
    next();
});

// ==========================================
// 3. INITIALIZE LEGENDS (AUTO-SEED)
// ==========================================
async function seedLegends() {
    const legends = [
        { 
            username: 'Silverhold', 
            password: 'Rian', 
            name: 'SilverHold Official', 
            role: 'Admin',
            quote: 'Jangan lupa sholat walaupun kamu seorang pendosa, Allah lebih suka orang pendosa yang sering bertaubat daripada orang yang merasa suci',
            hashtags: ['bismillahcalonustad']
        },
        { 
            username: 'BraynOfficial', 
            password: 'Plerr321', 
            name: 'Brayn Official', 
            role: 'Owner',
            quote: 'Tidak Semua Orang Suka Kita Berkembang Pesat!',
            hashtags: ['backenddev', 'frontenddev', 'BraynOfficial']
        }
    ];

    for (let data of legends) {
        const exist = await Admin.findOne({ username: data.username });
        if (!exist) {
            await Admin.create(data);
            console.log(`👑 Legend Created: ${data.username}`);
        }
    }
}

// ==========================================
// 4. ROUTES
// ==========================================

// Import Routes (Pastikan file ini ada di folder /routes)
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);

// Handling 404
app.use((req, res) => {
    res.status(404).render('index', { projects: [], admins: [], error: '404 - Page Not Found' });
});

// ==========================================
// 5. SERVER EXPORT (FOR VERCEL)
// ==========================================
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Platform running on http://localhost:${PORT}`);
    });
}

module.exports = app;
