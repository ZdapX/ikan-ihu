const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isLoggedIn } = require('../middleware/auth');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary Storage untuk Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'source-code-hub',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'png', 'jpeg', 'zip', 'txt', 'rar']
    }
});
const upload = multer({ storage: storage });

// --- AUTH ROUTES ---
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// --- DASHBOARD ROUTES (PROTECTED) ---
router.get('/dashboard', isLoggedIn, adminController.getDashboard);

// Upload Project (Handle 2 file: preview image & project file)
router.post('/upload', isLoggedIn, upload.fields([
    { name: 'preview', maxCount: 1 },
    { name: 'fileContent', maxCount: 1 }
]), adminController.createProject);

// Delete Project
router.post('/delete/:id', isLoggedIn, adminController.deleteProject);

// Profile Management
router.post('/profile/update', isLoggedIn, upload.single('photo'), adminController.updateProfile);

module.exports = router;
