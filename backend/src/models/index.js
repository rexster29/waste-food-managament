const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const db = require("../config/db");
// console.log(db,'db credentials')

const sequelize = new Sequelize(
  db.DATABASE, 
  db.USER,
  db.PASSWORD, {
  host: db.HOST,
  dialect: db.DIALECT,
  logging: false,
  pool:{
    max:40,
    min:0,
    acquire:30000,
    idle:10000
  }
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db1 = {};
db1.Sequelize = Sequelize;
db1.sequelize = sequelize;
db1.DataTypes = DataTypes;
db1.QueryTypes = QueryTypes;

console.log('all details')
// import all table models
db1.users = require("./users.model")(sequelize, DataTypes)
db1.foodListings = require("./foodListings.model")(sequelize, DataTypes)
db1.foodListingItems = require("./foodListingItems.model")(sequelize, DataTypes)
db1.foodCategories = require("./foodCategories.model")(sequelize, DataTypes)
db1.fileTypes = require("./fileTypes.model")(sequelize, DataTypes)
db1.entityTypes = require("./entityTypes.model")(sequelize, DataTypes)
db1.files = require("./files.model")(sequelize, DataTypes)
db1.fileAttachments = require("./fileAttachments.model")(sequelize, DataTypes)
db1.ratings = require("./ratings.model")(sequelize, DataTypes)
db1.notifications = require("./notifications.model")(sequelize, DataTypes)
db1.roles = require("./roles.model")(sequelize, DataTypes)
db1.permissions = require("./permissions.model")(sequelize, DataTypes)
db1.rolePermissions = require("./rolePermissions.model")(sequelize, DataTypes)
db1.statusMaster = require("./statusMaster.model")(sequelize, DataTypes)
db1.units = require("./units.model")(sequelize, DataTypes)
db1.otpVerifications = require('./otpverifications.model')(sequelize, DataTypes)
db1.authSessions = require('./authSessions.model')(sequelize, DataTypes)
db1.device = require('./device.model')(sequelize, DataTypes)
db1.advertisements = require('./advertisements.model')(sequelize, DataTypes)
db1.categories = require('./categories.models')(sequelize, DataTypes)
db1.contactDonor = require('./contactdonor.models')(sequelize, DataTypes)
db1.contactRequest = require('./contactRequest.models')(sequelize, DataTypes)
db1.timeMasters = require('./timeMaster.model')(sequelize, DataTypes)
db1.WeekdayMasters = require('./weekdayMaster.model')(sequelize, DataTypes)
db1.verificationDocumentMasters = require('./verificationDocumentMaster')(sequelize, DataTypes)
db1.availabilityUsers = require('./availabilityUsers.models')(sequelize, DataTypes)

console.log('all details 2')

db1.users.sync({
  alter: false,
});

module.exports = db1;