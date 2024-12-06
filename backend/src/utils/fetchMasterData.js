const db = require("../models");
const { entityTypes, fileTypes, foodCategories, permissions, roles } = db;

let fetchMasterData = async (tableName, errors = []) => {
    try {
        let fetchMasterDataDetails = await `${tableName}`.findAll({
            where: {
                statusId: 1,
            },
        });
        return fetchMasterDataDetails;
    }
    catch (error) {
        return errors.push("Something went wrong");
    }
}

module.exports = fetchMasterData;