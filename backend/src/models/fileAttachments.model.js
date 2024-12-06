module.exports = (sequelize, DataTypes) => {
    const fileAttachments = sequelize.define("fileAttachments", {
        fileAttachmentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fileId: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: "files",
            //     key: "fileId"
            // }
        },
        fileName: {
            type: DataTypes.STRING(50),
        },
        fileType: {
            type: DataTypes.STRING(50),
            // references: {
            //     model: "fileTypes",
            //     key: "fileTypeId"
            // }
        },
        url: {
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
    })
    return fileAttachments;
}