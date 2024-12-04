// src/utils/s3Upload.js
import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION
});

const s3 = new AWS.S3();

// Function to upload a file to S3
export const uploadToS3 = (file, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
      Key: `${folder}/${Date.now()}-${file.name}`, // Generate a unique file name
      Body: file,
      ContentType: file.type,
      // Remove the ACL parameter
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('S3 Upload Error:', err);
        reject(err); // Reject the promise if there is an error
      } else {
        resolve(data.Location); // Resolve with the URL of the uploaded file
      }
    });
  });
};