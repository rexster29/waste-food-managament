module.exports = (sequelize, DataTypes) => {
    let contactRequest = sequelize.define("contactRequest",  {
        contactRequestId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
        },
        email: {
            type: DataTypes.STRING(30),
        },
        phoneNumber: {
            type: DataTypes.STRING(10),
        },
        message: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        statusId: {
            type: DataTypes.INTEGER,
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        },
        createdOn: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedOn: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
    }, {
        schema: 'soulshare',
        timestamps: false   //disable Sequelize's automatic timestamps
    });
    return contactRequest;
}