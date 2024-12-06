let fs = require('fs');
const db = require('../models');
const files = db.files;
const fileTypeDb = db.fileTypes;
const fileAttachments = db.fileAttachments
const path = require('path');
const uploadDir = process.env.UPLOAD_DIR;

/**
 * function to save Image file
 * @param {ArrayBuffer} imageData 
 * @param {Number} entityType 
 * @param {String} subDir
 * @param {JSON} insertionData 
 * @param {Number} userId 
 * @param {Array} errors 
 * @param {Number} serialNumber 
 * @param {Object} transaction 
 * @returns 
 */
let imageUpload = async (imageData, entityType, subDir, insertionData, userId, errors, serialNumber, transaction) => {
  // e.g.  sub dir = "facility Images"
  // insertionData is the object whose work is to give the data in the format {id:2, name:'US'}
  try {
    console.log('image upload function entry')
    console.log(entityType, subDir, insertionData, userId, errors, serialNumber,  'these are all parameters in upload image function')
    let createdDt = new Date();
    let updatedDt = new Date();
    let uploadFilePath = null;
    let uploadFilePath2 = null;
    const base64ImageFile = imageData ? imageData.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
    console.log('base 64 image file line 10')
    const mimeMatch = imageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    const mime = mimeMatch ? mimeMatch[1] : null;

    console.log(mime, 'mime match',mimeMatch)
    if ([
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(mime.toLowerCase())) {
      console.log('base 64 image file line 21 certain mime type')

      // convert base 64 to buffer for image or document or set to null if not present
      const uploadImageFileBuffer = imageData ? Buffer.from(base64ImageFile, "base64") : null;
      // console.log(uploadImageFileBuffer,'25 upload image file buffer')
      if (uploadImageFileBuffer) {
        console.log('27', path.join(uploadDir, subDir))
        const imageFileDir = path.join(uploadDir, subDir);
        console.log(imageFileDir, '28 image file dir  image file buffer')
        // ensure the event image directory exists
        if (!fs.existsSync(imageFileDir)) {
          fs.mkdirSync(imageFileDir, { recursive: true });
        }
        const fileExtension = mime ? mime.split("/")[1] : "txt";

        console.log(fileExtension, '34 file extension image file buffer')

        let findTheFileType = await fileTypeDb.findOne({
          where:{
            fileTypeExtension: fileExtension
          },
          transaction, returning:true
          
        })
        console.log('23232')

        if(!findTheFileType){
          console.log('no file type')
          return errors.push(`Failed to fetch the image extension for facility file at index ${i}`);
        }
        console.log('find the file type', findTheFileType)

        uploadFilePath = `${imageFileDir}/${insertionData.id}${insertionData.name}_${serialNumber || null}.${fileExtension}`;

        fs.writeFileSync(uploadFilePath, uploadImageFileBuffer);
        uploadFilePath2 = `${subDir}/${insertionData.id}${insertionData.name}_${serialNumber || null}.${fileExtension}`;
        console.log(uploadFilePath2, "upload file path2 43")
        let fileName = `${insertionData.id}${insertionData.name}.${fileExtension}`;
        // let fileType = mime ? mime.split("/")[0] : 'unknown';
        console.log(fileName, "file path2 46")
        // insert to file table and file attachment table
        console.log(fileName, uploadFilePath2, 'create file data parameters')
        let createFile = await files.create({
          entityId: insertionData.id,
          entityType: entityType,
          statusId: 1,
          createdBy: userId,
          updatedBy: userId,
          createdOn: createdDt,
          updatedOn: updatedDt,
        },
          { transaction }
        );
        console.log('createFile', createFile)
        if (!createFile) {
          return errors.push(`Failed to create file  for facility file at index ${i}`);
        } else {
          console.log(insertionData, entityType, 'createFile', createFile, 'insert to file attachment')
          // Insert into file attachment table
          let createFileAttachment = await fileAttachments.create({
            fileName: fileName,
            fileType: findTheFileType.fileTypeId,
            fileId: createFile.fileId,
            url: uploadFilePath2,
            statusId: 1,
            createdOn: createdDt,
            updatedOn: updatedDt,
            createdBy: userId,
            updatedBy: userId
          },
            { transaction }
          );

          if (!createFileAttachment) {
            return errors.push(`Failed to create file attachment for facility file at index ${i}`);
          }
          return null;
        }
      }
    } else {
      return errors.push(`Invalid File type for facility file at index ${i}`);
    }
  } catch (err) {
    errors.push(`Something went wrong`)
  }
}

module.exports = imageUpload