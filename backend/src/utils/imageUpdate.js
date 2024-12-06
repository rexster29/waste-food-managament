let fs = require('fs-extra')
const db = require('../models')
const file = db.files;
const fileTypeDb = db.fileTypes;
const fileAttachment = db.fileAttachments
const path = require('path')

let  imageUpdate = async (imageData,subDir,insertionData,userId,errors,serialNumber,transaction,oldFilePath)=>{
    // e.g.  sub dir = "facility Images"
    // insertionData is the object whose work is to give the data in the format {id:2, name:'US'}
    try {
        let createdDt = new Date();
        let updatedDt = new Date();
        let uploadFilePath = null;
        let uploadFilePath2 = null;
        const uploadDir = process.env.UPLOAD_DIR;
        const base64ImageFile = imageData ? imageData.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
        console.log('base 64 image file line 10')
        const mimeMatch = imageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : null;
        // console.log(mime, mimeMatch,'mime match')
        if ([
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(mime)) {
          console.log('base 64 image file line 21 certain mime type')

          // convert base 64 to buffer for image or document or set to null if not present
          const uploadImageFileBuffer = imageData ? Buffer.from(base64ImageFile, "base64") : null;
          console.log('25 upload image file buffer')
          if (uploadImageFileBuffer) {
         
            const imageFileDir = path.join(uploadDir,subDir);
         
            // ensure the event image directory exists
            if (!fs.existsSync(imageFileDir)) {
              fs.mkdirSync(imageFileDir, { recursive: true });
            }
            const fileExtension = mime ? mime.split("/")[1] : "txt";

            let checkFileRemove = await fs.remove(`${imageFileDir.replace(/\\/g, '/')}${oldFilePath}`);
            console.log('old file path')

            console.log(checkFileRemove,'34 file extension image file buffer',`${imageFileDir.replace(/\\/g, '/')}${oldFilePath}`)

            uploadFilePath = `${imageFileDir}/${insertionData.id}${insertionData.name}_${serialNumber || null}.${fileExtension}`;

           console.log('upload file path', uploadFilePath)
           console.log(`${imageFileDir.replace(/\\/g, '/')}${oldFilePath}`);
           fs.writeFileSync(uploadFilePath, uploadImageFileBuffer);
            uploadFilePath2 = `/${subDir}/${insertionData.id}${insertionData.name}_${serialNumber || null}.${fileExtension}`;
            console.log(uploadFilePath2,"upload file path2 43")
            let fileName = `${insertionData.id}${insertionData.name}.${fileExtension}`;
            let findTheFileType = await fileTypeDb.findOne({
              where:{
                fileTypeExtension: fileExtension
              },
              transaction
            })
            if(!findTheFileType){
              return errors.push(`Failed to fetch the image extension for facility file at index ${i}`);
            }           
            // insert to file table and file attachment table
            let [createFileCount, createFileData] = await fileAttachment.update({
              fileName: fileName,
              fileType: findTheFileType.fileTypeId,
              url: uploadFilePath2,
              updatedDt: updatedDt,
              updatedBy:userId
            },
       { where:{
            fileId:insertionData.fileId
        },transaction});
            console.log('update file data', createFileCount)
            if (createFileCount==0) {
                await transaction.rollback()
              return errors.push(`Failed to create file  for facility file at index ${i}`);
            } else {
              // Insert into file attachment table
              let [createFileAttachmentCount, createFileAttachmentData] = await file.update({
                entityId: insertionData.id,
                statusId: 1,
                updatedDt: updatedDt,
                updatedBy:userId
              },
           { where:{
                fileId:insertionData.fileId
            },
            transaction}
          );
          console.log('create file attachment count', createFileAttachmentCount)
              if (createFileAttachmentCount==0) {
                return errors.push(`Failed to create file attachment for facility file at index ${i}`);
              }
              console.log('create file count',createFileAttachmentCount )
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


module.exports = imageUpdate