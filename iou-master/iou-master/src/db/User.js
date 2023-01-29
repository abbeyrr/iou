const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('user', {
        firstName: {
            type: Sequelize.STRING(64),
            allowNull: false,
            validate: {
                is: /^[A-Z\-" "]{1,64}$/i,
            }
        },
        lastName: {
            type: Sequelize.STRING(64),
            allowNull: false,
            validate: {
                is: /^[A-Z\-" "]{1,64}$/i,
            }
        },
        email: {
            type: Sequelize.STRING(256),
            allowNull: false,
            unique: { msg: 'This email address is already taken' },
            validate: {
                isEmail: { msg: 'Your email address must be valid' },
                len: { args: [4, 256], msg: 'Your email address must be between 4 and 256 characters long' },
            }
        },
        passwordHash: {
            type: Sequelize.STRING(161),
            allowNull: false
        },
        colour: {
            type: Sequelize.STRING(7),
            allowNull: false,
            default: '',
            validate: {
                is: /^|#[0-9a-f]{6}$/i,
            }
        }
    }, {

    });
}