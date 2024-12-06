module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
        },
        phoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        userType: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
            type: DataTypes.JSON,
        },
        googleAccountId: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        facebookAccountId: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
            default: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        createdBy: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: 'users', // references the same table
            //     key: 'userId',
            // },
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: 'users', // references the same table
            //     key: 'userId',
            // },
            allowNull: true,
        },
        createdOn: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedOn: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        statusId: {
            type: DataTypes.INTEGER,
        },
        timeOfDay: {
            type: DataTypes.STRING(50),
        },
        weekDay: {
            type: DataTypes.STRING(50),
        },
        verificationDocumentId: {
            type: DataTypes.INTEGER,
        }
    }, {
        schema: "soulshare",
        timestamps: false //disable Sequelize's automatic timestamps
    })
    return Users;
}