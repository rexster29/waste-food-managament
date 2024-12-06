module.exports = (sequelize, DataTypes) => {
    const advertisements = sequelize.define('advertisements', {
        advertisementId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        advertisementName: {
            type: DataTypes.STRING(100),
        },
        advertisementContent: {
            type: DataTypes.STRING(100),
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
        },
        adType: {
            type: DataTypes.ENUM('banner', 'popup', 'sidebar'),
        },
        adURL: {
            type: DataTypes.STRING(255),
        },
        amountCharged: {
            type: DataTypes.DECIMAL(10, 2),
        },
        currency: {
            type: DataTypes.STRING(10),
        },
        transactionId: {
            type: DataTypes.INTEGER,
        },
        statusId: {
            type: DataTypes.INTEGER,
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
        timestamps: false,
    });
    return advertisements;
}