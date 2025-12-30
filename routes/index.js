const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// --- VIEW ROUTES ---
// Halaman Utama
router.get('/', projectController.getHome);

// Halaman Detail Proyek /project/:id
router.get('/project/:id', projectController.getProjectDetail);

// --- API ROUTES (Untuk Real-time Interaksi) ---
// API Search
router.get('/api/search', projectController.searchProjects);

// API Like & Download
router.post('/api/like/:id', projectController.likeProject);
router.post('/api/download/:id', projectController.downloadProject);

module.exports = router;
