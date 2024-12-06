module.exports = (sequelize, DataTypes) => {
    const authSessions = sequelize.define('authSessions', {
        sessionId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER
        },
        deviceId: {
            type: DataTypes.INTEGER
        },
        lastActivity: {
            type: DataTypes.DATE,
            allowNull: false
        },
        active: {
            type: DataTypes.INTEGER
        }
    },
        {
            schema: 'soulshare',
            timestamps: false
        }
    )
    return authSessions
}

// Here we need to use a stored procedure that will automatically delete the session expired records.