module.exports = (sequelize, DataTypes) => {
    const verificationDocumentMaster = sequelize.define('verificationDocumentMasters', {
        documentTypeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        documentType: {
            type: DataTypes.STRING(50),
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
        timestamps: false,
    });
    return verificationDocumentMaster;
}