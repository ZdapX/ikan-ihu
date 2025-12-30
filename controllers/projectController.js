const Project = require('../models/Project');
const Admin = require('../models/Admin');

exports.getHome = async (req, res) => {
    try {
        // Ambil semua proyek, urutkan dari yang terbaru
        const projects = await Project.find().sort({ createdAt: -1 });
        // Ambil data admin untuk section CHAT
        const admins = await Admin.find();
        
        res.render('index', { projects, admins });
    } catch (err) {
        res.status(500).send("Cyber System Error");
    }
};

exports.getProjectDetail = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('authorId');
        if (!project) return res.redirect('/');
        
        res.render('project-detail', { project });
    } catch (err) {
        res.redirect('/');
    }
};

// Search Logic (Real-time API)
exports.searchProjects = async (req, res) => {
    const query = req.query.q;
    try {
        const projects = await Project.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { language: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
};

// Real-time Like Interaction
exports.likeProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id, 
            { $inc: { likes: 1 } }, 
            { new: true }
        );
        res.json({ success: true, likes: project.likes });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};

// Real-time Download Interaction
exports.downloadProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id, 
            { $inc: { downloads: 1 } }, 
            { new: true }
        );
        res.json({ success: true, downloads: project.downloads });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};
