module.exports = (sequelize,DataTypes)=>{
    let contactDonor = sequelize.define('contactDonor',{
        contactId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        mobileNo: {
            type: DataTypes.STRING(80),
        },
        userType: {
            type: DataTypes.INTEGER,
        },
        statusId: {
            type: DataTypes.INTEGER,
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
    }
    )

    return contactDonor
}