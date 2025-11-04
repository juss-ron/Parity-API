const Club = require('./Club');
const Member = require('./Member');
const User = require('./User');
const Transaction = require('./Transaction');

User.hasMany(Club, { as: 'clubs', foreignKey: 'userId' });
Club.belongsTo(User, { as: 'owner', foreignKey: 'userId' });

User.hasMany(Member, { as: 'memberships', foreignKey: 'userId' });
Member.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Club.hasMany(Member, { as: 'members', foreignKey: 'clubId' });
Member.belongsTo(Club, { as: 'club', foreignKey: 'clubId' });

Member.hasMany(Transaction, { as: 'transaction', foreignKey: 'memberId' });
Transaction.belongsTo(Member, { as: 'member', foreignKey: 'memberId' });

module.exports = { Club, Member, User, Transaction }