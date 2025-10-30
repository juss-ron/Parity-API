const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Member = sequelize.define('Member', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    clubId: {
        type: DataTypes.UUID,
        allowNull: false
    },

    investment: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    interestAcrued: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalInvestment: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    owing: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    interestOwing: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalOwing: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

Member.prototype.invest = async function (amount) {
    this.investment += amount;
    await this.save()
};

Member.prototype.payInterest = async function (amount) {
    if (amount <= 0) {
        res.json({ error: 'Amount must be greater than zero' })
    };
    if ( amount < this.interestOwing ) {
        this.interestOwing -= amount
    } else {
        this.interestOwing = 0
    };
    interestAcrued += amount;
    await this.save()
};

Member.prototype.payLoan = async function (amount) {
    this.owing -= amount;
    await this.save()
};

Member.prototype.loan = async function (amount) {
    this.owing += amount;
    this.interestOwing += (amount / 10);
    await this.save()
};

module.exports = Member