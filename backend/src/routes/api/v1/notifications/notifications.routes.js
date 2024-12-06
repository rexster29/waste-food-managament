const express = require('express');
const router = express.Router();
const api_version = process.env.API_VERSION
const notificationsController = require('../../../../controllers/'+api_version+'/notifications/notifications.controllers');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

router.post("/sendNotification", authenticateToken, notificationsController.sendNotification);

router.post("/viewNotificationList", authenticateToken, notificationsController.viewNotificationList);

router.get("/viewNotificationById", authenticateToken, notificationsController.viewNotificationById);

module.exports = router;