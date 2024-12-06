const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const cors = require("cors");
var cookieParser = require("cookie-parser");
let api_version = process.env.API_VERSION;
const uploadDir = process.env.UPLOAD_DIR;
const statusCode = require("./utils/statusCode");

const logger = require('./logger/index.logger')

//------------------------------------------path all files-----------------------------------------------------//
const authRoutes = require("./routes/api/" + api_version + "/auth/user.routes");
const foodsRoutes = require("./routes/api/" + api_version + "/foods/foods.routes");
const notificationRoutes = require("./routes/api/" + api_version + "/notifications/notifications.routes");
const activityRoutes = require('./routes/api/' + api_version + '/activity/activity.routes');
//-------------------------------------------------------------------------------------------------------------//



//----------------------------------------------middlewares-----------------------------------------------------//
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// limit the json data size
app.use(express.json({ limit: "20mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb"
  })
);

app.use((req,res,next)=>{
  console.log('inside logger info')
  logger.info(`Received ${req.method} request for ${req.url}`);
  // Set Cache-Control header for 30 days (30 days * 24 hours * 60 minutes * 60 seconds)
  res.set('Cache-Control', 'public, max-age=' + (30 * 24 * 60 * 60));
  next();
})

app.use('/sshare/static', express.static(uploadDir));

app.use(cookieParser());
// app.use(requestLogger);

//-------------------------------------------------------------------------------------------------------------//


//-------------------------------------------define router-----------------------------------------------------//
// app.use("/share",(req,res,next)=>{
//   next()
// })
app.use("/sshare/auth", authRoutes);
app.use("/sshare/food", foodsRoutes);
app.use("/sshare/notification", notificationRoutes);
app.use("/sshare/activity", activityRoutes);
//-------------------------------------------------------------------------------------------------------------//

app.use((err, req, res, next)=>{
  if(err){
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:"something went wrong"
    })
  }
})

module.exports = {
  app
};