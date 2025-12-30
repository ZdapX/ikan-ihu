// Middleware untuk mengecek status login admin
module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.session.admin) {
            return next();
        }
        res.redirect('/admin/login');
    }
};
