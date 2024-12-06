module.exports = (sequelize, DataTypes) => {
    let Device = sequelize.define('device', {
        deviceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sessionId: {
            type: DataTypes.INTEGER,

        },
        deviceName: {
            type: DataTypes.STRING
        },
        deviceType: {
            type: DataTypes.STRING
        }
    },
        {
            schema: 'soulshare',
            timestamps: false
        })
    return Device
}