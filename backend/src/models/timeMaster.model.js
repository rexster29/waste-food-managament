module.exports = (sequelize, DataTypes) => {
    const TimeMaster = sequelize.define('timeMasters', {
        timeMasterId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        timeFrom: {
            type: DataTypes.STRING(20),
        },
        timeTo: {
            type: DataTypes.STRING(20),
        },
        timeFormat: {
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
    return TimeMaster;
}