// is authenticated middleware checks if user is logged in
exports.isAuthenticated = check => (req, res, next) => {

    // if user is logged in, proceed to next
    if (check) {
        if (req.user) next()
        else res.redirect(`/auth/?continue=${req.originalUrl}`)
    }
    /// if user is logged in do not go to auth
    else {
        if (req.user) 
            return res.status(200).send('already logged in')            
        
        next()
    }
}

// csrf protection middleware
var csurf = require('csurf')
var csrf = csurf({
    cookie: true
});
exports.csrf = csrf