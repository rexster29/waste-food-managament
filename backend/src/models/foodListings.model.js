module.exports = (sequelize, DataTypes) => {
    const foodListings = sequelize.define("foodListings", {
        foodListingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // references: {
            //     model: "users", //foreign key ref to users.userId
            //     key: "userId"
            // }
        },
        categoryId:{
            type:DataTypes.INTEGER
        },
        address: {
            type: DataTypes.JSON,
        },
        receiverId: {   // if chartity org or individual selected
            type: DataTypes.INTEGER,
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
    return foodListings;
}