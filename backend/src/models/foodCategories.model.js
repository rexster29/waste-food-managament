module.exports = (sequelize, DataTypes) => {
    const foodCategories = sequelize.define("foodCategories", {
        foodCategoryId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
        },
        foodCategoryName: {
            type: DataTypes.STRING(80),
            allowNull: false,
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
    return foodCategories;
}