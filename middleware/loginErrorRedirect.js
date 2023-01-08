const loginErrorRedirect = (err, req, res, next) => {
    if (err) {
        res.redirect(`${process.env.WEB_URL}/login/failed?message=${err.message}`);
    }
}

module.exports = loginErrorRedirect;