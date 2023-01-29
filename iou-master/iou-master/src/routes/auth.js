const crypto = require('crypto');
const db = require('../db');
const auth = require('../auth');

module.exports = (app) => {

    // API route for authenticating
    app.post('/api/auth', (req, res) => {
        db.User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user == null) {
                // User doesn't exist
                res.status(400); // Bad Request
                res.send({ err: 'The email you entered is not linked to an account' });
                return;
            } else {
                // User exists
                const [salt, key] = user.passwordHash.split(":")
                crypto.scrypt(req.body.password, salt, 64, (err, derivedKey) => {
                    if (err) throw (err);

                    if (key == derivedKey.toString('hex')) {
                        // Correct password
                        let refreshToken = auth.generateRefreshToken(user.id);
                        db.RefreshToken.create({ token: refreshToken, userId: user.id });
                        let token = auth.generateToken(user.id);
                        res.send({
                            refreshToken: refreshToken,
                            token: token,
                        });
                        return;
                    } else {
                        // Incorrect password
                        res.status(400); // Bad Request
                        res.send({ err: 'The password you entered is incorrect' });
                        return;
                    }
                });
            }
        });
    });

    // API route for refreshing auth tokens
    app.post('/api/auth/refresh', (req, res) => {
        auth.verifyToken(req.body.refreshToken, (err, payload) => {
            if (err) {
                res.status(400); // Bad Request
                res.send({ err: 'Invalid token' });
                return;
            }

            if (!payload.refresh) {
                res.status(400); // Bad Request
                res.send({ err: 'Invalid token' });
                return;
            } else {

                db.RefreshToken.findOne({ where: { token: req.body.refreshToken } }).then(currentRefreshToken => {
                    if (currentRefreshToken == null) {
                        res.status(400); // Bad Request
                        res.send({ err: 'Invalid token' });
                        return;
                    } else {
                        let refreshToken = auth.generateRefreshToken(payload.id);
                        db.RefreshToken.update(
                            { token: refreshToken },
                            {
                                where: { id: currentRefreshToken.id }
                            }
                        );
                        let token = auth.generateToken(payload.id);
                        res.send({
                            refreshToken: refreshToken,
                            token: token,
                        });
                        return;
                    }
                });

            }

        });
    });

}