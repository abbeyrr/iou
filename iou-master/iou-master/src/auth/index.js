require('dotenv').config();

const jwt = require('jsonwebtoken');
const db = require('../db');

function generateToken(id) {
    return jwt.sign({ id: id, refresh: false }, process.env.JWT_SECRET, {
        algorithm: 'HS512',
        expiresIn: '2m',
    });
}

function generateRefreshToken(id) {
    return jwt.sign({ id: id, refresh: true }, process.env.JWT_SECRET, {
        algorithm: 'HS512',
        expiresIn: '5d',
    });
}

function verifyToken(token, callback) {
    jwt.verify(token, process.env.JWT_SECRET, {
        algorithm: 'HS512',
    }, callback);
}

function checkAuth(req, res, next) {

    if (req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ');

        if (authorization.length == 2 && authorization[0] == 'Bearer') {
            verifyToken(authorization[1], (err, payload) => {
                if (err) {
                    res.status(403); // Forbidden
                    res.send({ err: 'Invalid token' });
                    return;
                } else {
                    if (payload.refresh) {
                        res.status(403); // Forbidden
                        res.send({ err: 'Invalid token' });
                        return;
                    } else {
                        res.locals.userId = payload.id;
                        next();
                    }
                }
            });
        } else {
            res.status(403); // Forbidden
            res.send({ err: 'Invalid authorization header' });
            return;
        }

    } else {
        res.status(403);
        res.send({ err: 'No authorization header sent' });
        return;
    }
}

function getUserData(req, res, next) {
    db.User.findOne({ where: { id: res.locals.userId }, include: db.House }).then(user => {
        if (user == null) {
            // User doesn't exist
            res.status(400); // Bad Request
            res.send({ err: 'The user doesn\'t exist' });
            return;
        } else {
            res.locals.user = {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                colour: user.colour,
            };
            res.locals.houses = user.houses.map(house => { return { id: house.id, name: house.name, colour: house.colour } });
            res.locals.houseIds = res.locals.houses.map(house => house.id);
            next();
        }
    });
}

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    checkAuth,
    getUserData,
};