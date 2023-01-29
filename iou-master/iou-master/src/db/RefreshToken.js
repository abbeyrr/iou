const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('refreshToken', {
        token: {
            type: Sequelize.STRING(256),
            allowNull: false
        }
    }, {

    });
}