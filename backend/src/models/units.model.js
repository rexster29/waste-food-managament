module.exports = (sequelize, DataTypes) => {
    const units = sequelize.define("units", {
        unitId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        unitName: {
            type: DataTypes.STRING(20),
        },
        unitDescription: {
            type: DataTypes.STRING(100),
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
        schema: "soulshare",
        timestamps: false //disable Sequelize's automatic timestamps
    });
    return units;
}