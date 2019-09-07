module.exports = {
    // renders the home page
    Index: (req, res) => {
        req.app.render(req, res, "/dashboard/Dashboard", req.query);
    },
    // renders all the other pages
    AllPages: (req, res) => {
        const handle = req.app.getRequestHandler();
        handle(req, res);
    },
    // renders auth page
    Auth: (req, res) => {
        req.app.render(req, res, "/auth/Login", req.query);
    },
    // renders the about page
    About: (req, res) => {
        req.app.render(req, res, "/Index", req.query);
    }
}
