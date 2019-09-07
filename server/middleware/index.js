const { logInfo } = require('../../common/logger')
// is authenticated middleware checks if user is logged in
exports.isAuthenticated = check => (req, res, next) => {
    logInfo('server redirect: ', {user: req.user, check})

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
// passes the app instance to the server routes
exports.mainAppMiddleware = app => (req, _, next) => {
    logInfo('setting up main middleware')
    req.app = app
    next();
}
// csrf protection middleware
var csurf = require('csurf')
var csrf = csurf({
    cookie: true
});
module.exports.csrf = csrf