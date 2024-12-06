module.exports = (sequelize, DataTypes) => {
    const WeekdayMaster = sequelize.define('weekdayMasters', {
        weekdayMasterId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        weekday: {
            type: DataTypes.STRING(20),
        },
        statusId: {
            type: DataTypes.INTEGER,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdOn: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedOn: {
            type: DataTypes.DATE,
        },
    }, {
        schema: "soulshare",
        timestamps: false //disable Sequelize's automatic timestamps
    });
    return WeekdayMaster;
}