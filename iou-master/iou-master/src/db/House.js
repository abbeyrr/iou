const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('house', {
        name: {
            type: Sequelize.STRING(64),
            allowNull: false,
            validate: {
                is: /^[0-9A-Z" "\']{1,64}$/i,
            }
        },
        colour: {
            type: Sequelize.STRING(7),
            allowNull: false,
            default: '',
            validate: {
                is: /^|#[0-9a-f]{6}$/i,
            }
        },
        password: {
            type: Sequelize.STRING(64),
            allowNull: false,
            default: '',
        }
    }, {

    });
}