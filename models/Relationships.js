const Club = require('./Club');
const Member = require('./Member');
const User = require('./User');

User.hasMany(Club, { as: 'clubs', foreignKey: 'userId' });
Club.belongsTo(User, { as: 'clubs', foreignKey: 'userId' });

User.hasMany(Member, { as: 'clubs', foreignKey: 'userId' });
Member.belongsTo(User, { as: 'clubs', foreignKey: 'userId' });

Club.hasMany(Member, { as: 'clubs', foreignKey: 'clubId' });
Member.belongsTo(Club, { as: 'clubs', foreignKey: 'clubId' });

module.exports = { Club, Member, User }