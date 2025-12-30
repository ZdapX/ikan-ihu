const Admin = require('../models/Admin');
const Project = require('../models/Project');

// Kredensial Hardcoded
const LEGENDS_CREDENTIALS = [
    { username: 'Silverhold', password: 'Rian', name: 'SilverHold Official', role: 'Admin' },
    { username: 'BraynOfficial', password: 'Plerr321', name: 'Brayn Official', role: 'Owner' }
];

exports.getLogin = (req, res) => {
    if (req.session.admin) return res.redirect('/admin/dashboard');
    res.render('admin/login');
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    const legend = LEGENDS_CREDENTIALS.find(u => u.username === username && u.password === password);

    if (legend) {
        // Cari atau buat record admin di DB untuk menyimpan metadata (quote/photo)
        let adminRecord = await Admin.findOne({ username });
        if (!adminRecord) {
            adminRecord = await Admin.create(legend);
        }
        req.session.admin = adminRecord;
        return res.redirect('/admin/dashboard');
    }
    res.render('admin/login', { error: 'Invalid Identity, Intruder!' });
};

exports.getDashboard = async (req, res) => {
    const projects = await Project.find({ authorId: req.session.admin._id }).sort({ createdAt: -1 });
    res.render('admin/dashboard', { projects, admin: req.session.admin });
};

exports.createProject = async (req, res) => {
    const { name, language, type, notes, codeContent } = req.body;
    let content = type === 'CODE' ? codeContent : req.files['fileContent'][0].path;
    let previewUrl = req.files['preview'] ? req.files['preview'][0].path : '';

    await Project.create({
        name, language, type, notes, content, previewUrl,
        authorId: req.session.admin._id
    });
    res.redirect('/admin/dashboard');
};

exports.deleteProject = async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
};

exports.updateProfile = async (req, res) => {
    const { name, quote, hashtags, newPassword } = req.body;
    const updateData = { name, quote, hashtags: hashtags.split(',') };
    
    if (req.file) updateData.photoUrl = req.file.path;
    if (newPassword) updateData.password = newPassword;

    const updatedAdmin = await Admin.findByIdAndUpdate(req.session.admin._id, updateData, { new: true });
    req.session.admin = updatedAdmin;
    res.redirect('/admin/dashboard');
};
