const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('transaction', {
        datetime: {
            type: Sequelize.DATE,
            allowNull: false,
            default: Sequelize.NOW,
        },
        amount: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            default: Sequelize.NOW,
            validate: {
                min: 0,
            },
        }
    }, {

    });
}