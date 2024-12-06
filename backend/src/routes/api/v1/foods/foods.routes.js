const express = require('express');
const router = express.Router();
const api_version = process.env.API_VERSION
const foodsController = require('../../../../controllers/'+api_version+'/foods/foods.controllers');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

router.post("/addFoodDonationRequest", authenticateToken, foodsController.addFoodDonationRequest);

router.get("/initialData", foodsController.initialData);

router.post("/viewFoodDonationList", foodsController.viewFoodDonationList);

router.get("/viewFoodDonationById/:id", foodsController.viewFoodDonationById);

router.put("/acceptFoodDonation", authenticateToken, foodsController.acceptFoodDonation);

router.put("/closeFoodDonation", authenticateToken, foodsController.closeFoodDonation);

router.post("/viewFoodPickupList", authenticateToken, foodsController.viewFoodPickupList);

router.get("/viewFoodPickupById/:id", authenticateToken, foodsController.viewFoodPickupById);

router.post('/donationHistory', authenticateToken, foodsController.donationHistory);

router.post('/contactDonor', foodsController.contactDonor);





module.exports = router;