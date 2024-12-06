module.exports = (sequelize, DataTypes) => {
    const fileTypes = sequelize.define("fileTypes", {
        fileTypeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fileTypeExtension: {
            type: DataTypes.STRING(20),
        },
        fileTypeName: {
            type: DataTypes.STRING(30),
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
        timestamps: false,
    });
    return fileTypes;
}