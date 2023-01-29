const auth = require('../auth');

module.exports = (app) => {

    require('./user')(app);
    require('./auth')(app);
    require('./house')(app);
    require('./money')(app);

    app.get('/test', auth.checkAuth, (req, res) => {
        res.send(`You are logged in with user ID: ${res.locals.userId}`);
        return;
    });

}