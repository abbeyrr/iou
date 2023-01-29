const { ValidationError } = require('sequelize');
const auth = require('../auth');
const db = require('../db');

module.exports = (app) => {
    // API route to get a house's data
    app.get('/api/house/:id/get', auth.checkAuth, auth.getUserData, (req, res) => {
        if (!isNaN(req.params.id)) {
            if (res.locals.houseIds.includes(parseInt(req.params.id))) {
                db.House.findOne({ where: { id: req.params.id }, include: db.User }).then(house => {
                    if (house == null) {
                        // House doesn't exist
                        res.status(400); // Bad Request
                        res.send({ err: 'The house doesn\'t exist' });
                        return;
                    } else {
                        res.send({
                            id: house.id,
                            name: house.name,
                            colour: house.colour,
                            password: house.password,
                            members: house.users.map(user => {
                                return {
                                    id: user.id,
                                    name: `${user.firstName} ${user.lastName}`,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    colour: user.colour,
                                }
                            }),
                        });
                        return;
                    }
                });
            } else {
                res.status(401);
                res.send({ err: 'Not a member of that house' });
                return;
            }
        } else {
            res.status(400);
            res.send({ err: 'Bad house id' });
            return;
        }
    });

    app.post('/api/house/:id/update', auth.checkAuth, auth.getUserData, (req, res) => {
        if (!isNaN(req.params.id)) {
            if (res.locals.houseIds.includes(parseInt(req.params.id))) {
                db.House.update(
                    {
                        colour: req.body.colour,
                        password: req.body.password,
                        name: req.body.name,
                    },
                    {
                        where: { id: parseInt(req.params.id) }
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
                res.send({ err: 'Not a member of that house' });
                return;
            }
        } else {
            res.status(400);
            res.send({ err: 'Bad house id' });
            return;
        }
    });

    app.post('/api/house/create', auth.checkAuth, (req, res) => {
        db.House.create({
            name: req.body.houseName,
            colour: req.body.houseColor,
            password: req.body.housePass,
        }).then(result => {

            db.Membership.create({
                userId: res.locals.userId,
                houseId: result.id
            }).then(() => {
                res.send({});
                return;
            }).catch(err => {
                console.log(err);

                res.status(500); // Internal Server Error
                res.send({ err: 'Unknown error' });
                return;
            });

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

    app.post('/api/house/join', auth.checkAuth, (req, res) => {
        db.House.findOne({ where: { id: req.body.houseId } }).then(house => {
            if (house == null) {
                res.status(400);
                res.send({ err: 'The house doesn\'t exist' });
                return;
            } else {
                if (req.body.housePass == house.password) {
                    db.Membership.create({
                        userId: res.locals.userId,
                        houseId: req.body.houseId
                    }).then(() => {
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
                } else {
                    res.status(401);
                    res.send({ err: "Wrong password" });
                    return;
                }
            }
        }).catch(err => {
            console.log(err);
            res.status(500);
            res.send({ err: 'DB error' });
            return;
        });
    });
}