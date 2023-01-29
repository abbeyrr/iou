require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mariadb',
    logging: false
});

// sequelize.authenticate();

const User = require('./User')(sequelize);
const House = require('./House')(sequelize);
const Membership = require('./Membership')(sequelize);
const RefreshToken = require('./RefreshToken')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const Message = require('./Message')(sequelize);

RefreshToken.belongsTo(User);

User.belongsToMany(House, { through: Membership });
House.belongsToMany(User, { through: Membership });

Transaction.belongsTo(House);
Transaction.belongsTo(User, { as: 'senderUser' });
Transaction.belongsTo(User, { as: 'receiverUser' });

Message.belongsTo(House);

sequelize.sync();

module.exports = {
    sequelize,
    User,
    House,
    Membership,
    RefreshToken,
    Transaction,
    Message,
};