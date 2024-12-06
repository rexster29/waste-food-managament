module.exports = (sequelize, DataTypes) => {
    const rolePermissions = sequelize.define("rolePermissions", {
        roleId: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: "roles",
            //     key: "roleId"
            // }
        },
        permissionId: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: "permissions",
            //     key: "permissionId"
            // }
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
        uniqueKeys: {
            role_permission_unique: {
                fields: ['roleId', 'permissionId']
            }
        }
    });
    return rolePermissions;
}