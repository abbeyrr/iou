const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('message', {
        username: {
            type: Sequelize.STRING(128),
            allowNull: false,
        },
        text: {
            type: Sequelize.STRING(2048),
            allowNull: false,
        },
        datetime: {
            type: Sequelize.DATE,
            allowNull: false,
            default: Sequelize.NOW,
        }
    }, {

    });
}