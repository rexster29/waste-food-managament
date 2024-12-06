
module.exports = (sequelize,DataTypes)=>{
    let otpVerifications = sequelize.define('otpVerifications',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        mobileNo:{
            type:DataTypes.STRING(255)
        },
        code:{
            type:DataTypes.STRING
        },
        expiryTime:{
            type:DataTypes.DATE
        },
        verified:{
            type:DataTypes.INTEGER
        },
        createdOn: {
            type:DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        updatedOn: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        }
    }, {
        schema: "soulshare",
        timestamps: false
    }
)
    return otpVerifications
}


