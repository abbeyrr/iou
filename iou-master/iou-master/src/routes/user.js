const crypto = require('crypto');
const { ValidationError } = require('sequelize');
const auth = require('../auth');
const db = require('../db');

module.exports = (app) => {

    // API route to get the current users data
    app.get('/api/user/get', auth.checkAuth, auth.getUserData, (req, res) => {
        res.send({
            user: res.locals.user,
            houses: res.locals.houses,
        });
        return;
    });

    // API route for creating a new user
    app.post('/api/user/register', (req, res) => {
        if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(req.body.password)) {
            // Password isn't strong enough
            res.status(400); // Bad Request
            res.send({ err: 'Your password must be at least 8 characters long and include an upper case letter, a lower case letter, and a number' });
            return;
        } else {
            // Hash the password
            let salt = crypto.randomBytes(16).toString('hex');
            crypto.scrypt(req.body.password, salt, 64, (err, derivedKey) => {
                if (err) throw err;

                db.User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    passwordHash: `${salt}:${derivedKey.toString('hex')}`,
                    colour: '#757575'
                }).then(() => {
                    // The account has been successfully created
                    res.send({});
                    return;
                }).catch(err => {
                    if (err instanceof ValidationError) {
                        // Some of the provided data was not valid, send the first validation error
                        res.status(400); // Bad Request
                        res.send({ err: err.errors[0].message });
                        return;
                    } else {
                        console.log(err);

                        res.status(500); // Internal Server Error
                        res.send({ err: 'Unknown error' });
                        return;
                    }
                });
            });
        }

    });

    app.post('/api/user/update', auth.checkAuth, (req, res) => {
        if (res.locals.userId == req.body.id) {
            db.User.update(
                { colour: req.body.colour },
                {
                    where: { id: req.body.id }
                }
            ).then(result => {
                res.send({});
                return;
            }).catch(err => {
                console.log(err);
                res.status(500);
                res.send({ err: 'DB error' });
                return;
            });
        } else {
            res.status(401);
            res.send({ err: 'Bad credentials' });
            return;
        }
    });

}