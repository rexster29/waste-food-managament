module.exports = (sequelize, DataTypes) => {
    const foodListingItems = sequelize.define("foodListingItems", {
        foodListingItemId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        foodListingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        foodName: {
            type: DataTypes.STRING(150),
        },
        foodCategory: {
            type: DataTypes.INTEGER,
            // references: {
            //     model: "foodCategories",
            //     key: "foodCategoryId"
            // }
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        unit: {
            type: DataTypes.INTEGER,
        },
        expirationDate: {
            type: DataTypes.DATE,
        },
        description: {
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
        timestamps: false //disable Sequelize's automatic timestamps
    })
    return foodListingItems;
}