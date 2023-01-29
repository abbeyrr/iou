const auth = require('../auth');
const db = require('../db');

const { Ledger, Person, Transaction } = require('../money/money');

module.exports = (app) => {
    app.get('/api/house/:houseId/transactions/all', auth.checkAuth, auth.getUserData, (req, res) => {
        const houseId = parseInt(req.params.houseId);
        if (!isNaN(houseId)) {
            if (res.locals.houseIds.includes(houseId)) {
                db.Transaction.findAll({ where: { houseId: houseId } }).then(transactions => {
                    res.status(200);
                    res.send({
                        transactions: transactions.map(t => {
                            return {
                                id: t.id,
                                timestamp: t.datetime,
                                amount: t.amount,
                                sender: t.senderUserId,
                                receiver: t.receiverUserId,
                            }
                        })
                    });
                });
            } else {
                res.status(401);
                res.send({ err: 'Not a member of that house' });
            }
        } else {
            res.status(400);
            res.send({ err: 'Bad house id' });
        }
    });

    app.get('/api/house/:houseId/transactions/balance/:personId', auth.checkAuth, auth.getUserData, (req, res) => {
        const houseId = parseInt(req.params.houseId);
        const personId = parseInt(req.params.personId);

        if (!isNaN(houseId) && !isNaN(personId)) {
            if (res.locals.houseIds.includes(houseId)) {
                const target = new Person(personId);
                const ledger = new Ledger();
                // register all the members of the house
                db.House.findOne({ where: { id: houseId }, include: db.User }).then(house => {
                    house.users
                        .map(user => user.id)
                        .forEach(id => {
                            ledger.register(new Person(id));
                        });

                    db.Transaction.findAll({ where: { houseId: houseId } }).then(transactions => {
                        transactions.map(t => {
                            const from = t.senderUserId;
                            const to = t.receiverUserId;
                            return new Transaction(from, to, t.amount);
                        }).forEach(t => ledger.push(t));

                        res.status(200);
                        res.send({
                            balance: target.balance(ledger),
                        });
                    });
                });
            } else {
                res.status(401);
                res.send({ err: 'Not a member of that house' });
            }
        } else {
            res.status(400);
            res.send({ err: 'Bad house or person id' });
        }
    });

    app.get('/api/house/:houseId/transactions/simplify', auth.checkAuth, auth.getUserData, (req, res) => {
        const houseId = parseInt(req.params.houseId);

        if (!isNaN(houseId)) {
            if (res.locals.houseIds.includes(houseId)) {
                const ledger = new Ledger();
                // register all the members of the house
                db.House.findOne({ where: { id: houseId }, include: db.User }).then(house => {
                    house.users
                        .map(user => user.id)
                        .forEach(id => {
                            ledger.register(new Person(id));
                        });
                    // push all the transactions
                    db.Transaction.findAll({ where: { houseId: houseId } }).then(transactions => {
                        transactions.map(t => {
                            const from = t.senderUserId;
                            const to = t.receiverUserId;
                            return new Transaction(from, to, t.amount);
                        }).forEach(t => {
                            ledger.push(t);
                        });
                        // reduce the amount of transactions
                        ledger.reduce();
                        // return the new transaction array
                        res.status(200);
                        var id = 0;
                        res.send({
                            transactions: ledger.list.map(t => {
                                return {
                                    id: id++,
                                    timestamp: Date.now(),
                                    amount: t.value,
                                    sender: t.from,
                                    receiver: t.to,
                                }
                            }),
                        });
                    });
                });
            } else {
                res.status(401);
                res.send({ err: 'Not a member of that house' });
            }
        } else {
            res.status(400);
            res.send({ err: 'Bad house id' });
        }
    });

    app.post('/api/house/:houseId/transactions/pay', auth.checkAuth, auth.getUserData, (req, res) => {
        const houseId = parseInt(req.params.houseId);
        const body = req.body;

        if (isNaN(houseId)) {
            res.status(400);
            res.send({ err: 'Bad house id' });
            return;
        }

        if (body.recipient == null) {
            res.status(400);
            res.send({ err: 'Must specify a recipient' });
            return;
        }

        db.House.findOne({ where: { id: houseId }, include: db.User })
            .then(house => {
                const users = house.users.map(user => user.id);

                if (!users.includes(body.recipient)) {
                    res.status(401);
                    res.send({ err: 'Recipient must be part of the current house' })
                    return;
                }

                const sender = new Person(res.locals.user.id);
                const receiver = new Person(body.recipient);
                const amount = body.amount;

                if (typeof amount === 'number' && amount > 0) {
                    const t = sender.pay({ amount, to: receiver });
                    if (t instanceof Error) {
                        res.status(400);
                        res.send({ err: t.message });
                        return;
                    }
                    res.status(200);
                    db.Transaction.create({
                        houseId: houseId,
                        datetime: Date.now(),
                        amount: t.value,
                        senderUserId: t.from,
                        receiverUserId: t.to,
                    });
                    res.send({});
                } else {
                    res.status(400);
                    res.send({ err: 'Must give an amount, greater than zero, to pay to the recipient' });
                }
            });
    });
}