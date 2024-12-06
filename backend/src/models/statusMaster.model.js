module.exports = (sequelize, DataTypes) => {
    const statusMaster = sequelize.define("statusMasters", {
        statusId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        statusCode: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
        },
        parentStatusCode: {
            type: DataTypes.STRING(100)
        },
        createdBy: {
            type: DataTypes.INTEGER
        },
        createdOn: {
            type: DataTypes.DATE, // Define the column as DATE type
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
        },
        updatedBy: {
            type: DataTypes.INTEGER
        },
        updatedOn: {
            type: DataTypes.DATE // Define the column as DATE type
        },
        deletedBy: {
            type: DataTypes.INTEGER
        },
        deletedOn: {
            type: DataTypes.DATE // Define the column as DATE type
        }
    }, {
        schema: "soulshare",
        timestamps: false
    });
    return statusMaster;
}