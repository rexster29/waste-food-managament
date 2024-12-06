module.exports = (sequelize, DataTypes) => {
    const ratings = sequelize.define("ratings", {
        ratingId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        entityType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // references: {
            //     model: "entityTypes",
            //     key: "entityTypeId"
            // }
        },
        rating: {
            type: DataTypes.INTEGER,
        },
        comment: {
            type: DataTypes.STRING(200),
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
        timestamps: false
    });
    return ratings;
}