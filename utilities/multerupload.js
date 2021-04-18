//This module requires an AWS access key (AWS_ACCESS_KEY_ID) and secret key
//(AWS_SECRET_ACCESS_KEY) to be stored in the .env file. This is not apparent from the code
//below because initialization of the s3 object automatically utilizes the 
//aws keys stored in the .env file. 

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const bucket = process.env.BUCKET;
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require("aws-sdk");

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket,
        acl: 'private',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})





module.exports = upload;