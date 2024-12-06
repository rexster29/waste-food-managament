const db = require("../../../models/index");
const { advertisements, files, fileAttachments, sequelize } = db;
let statusCode = require("../../../utils/statusCode");
const imageUpload = require("../../../utils/imageUpload");
const { QueryTypes } = require("sequelize");
const logger = require('../../../logger/index.logger')

let addNewAdvertisement = async (req, res) => {
    try {
        let transaction = await sequelize.transaction();
        let { advertisementName, advertisementContent, startDate, endDate, adType, adURL, adImage } = req.body;
        console.log({ advertisementName, advertisementContent, startDate, endDate, adType, adURL });
        console.log(1);
        if (!advertisementName && !advertisementContent && !startDate && !endDate && !adType) {
            console.log(2)
            await transaction.rollback();
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Please provide all required data"
            });
        }
        console.log(3);
        let newAdvertisement = await advertisements.create({
            advertisementName, advertisementContent, startDate, endDate, adType, adURL
        }, { transaction });
        console.log(4);
        if (!newAdvertisement) {
            console.log(5);
            await transaction.rollback();
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "something went wrong."
            });
        }
        console.log(6)
        if (adImage) {
            console.log(7)
            let insertionData = {
                id: newAdvertisement.advertisementId,
                name: advertisementName
            }
            // create the data
            let entityType = 'advertisement'
            let errors = [];
            let subDir = "advertisementDir"
            let uploadSingleImage = await imageUpload(userImage, entityType, subDir, insertionData, newUser.userId, errors, 1, transaction)
            console.log('8 error advertisement image', uploadSingleImage)
            if (errors.length > 0) {
                console.log(9)
                await transaction.rollback();
                if (errors.some(error => error.includes("something went wrong"))) {
                    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors })
                }
                return res.status(statusCode.BAD_REQUEST.code).json({ message: errors })
            }
        }
        console.log(10)
        if (newAdvertisement) {
            console.log(11)
            await transaction.commit();
            // Return success response
            return res.status(statusCode.SUCCESS.code).json({
                message: "Ad details added successfully", advertisement: newAdvertisement
            })
        }
        else {
            console.log(12)
            await transaction.rollback();
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: `Adding ad details failed.`
            })
        }
    }
    catch (error) {
        console.log(13)
        if (transaction) await transaction.rollback();
        logger.error(`An error occurred: ${error.message}`); // Log the error
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let getAdvertisementList = async (req, res) => {
    try {
        let fetchAdvertisementList = await sequelize.query(`
            select a."advertisementId", a."advertisementName", a."advertisementContent", a."startDate", a."endDate", a."adType", a."adURL", fa."fileName", fa.url 
            from soulshare.advertisements a
            inner join soulshare.files f on a."advertisementId" = f."entityId" and f."entityType" = 'advertisement'
            inner join soulshare."fileAttachments" fa on fa."fileId" = f."fileId"
            where a."statusId" = 1`,
            {
                type: QueryTypes.SELECT
            }
        );

        console.log('fetchAdvertisementList', fetchAdvertisementList);

        return res.status(statusCode.SUCCESS.code).json({
            message: "list of advertisements",
            advertisements: fetchAdvertisementList.map((ad) => {
                return {
                    ...ad,
                    "url": encodeURI(ad.url)
                }
            })
        })
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    addNewAdvertisement,
    getAdvertisementList
}