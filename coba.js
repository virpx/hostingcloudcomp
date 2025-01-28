const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const app = express();
const PORT = 3000;

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, 'elearning-447808-3f750f5f211a.json'), // Replace with your key file path
  projectId: 'elearning-447808', // Replace with your project ID
});

// Define your bucket name
const bucketName = 'elearning-bucket-2025'; // Replace with your bucket name
const bucket = storage.bucket(bucketName);

// Set up Multer for file uploads
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

// Upload file endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error uploading file.');
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        res.status(200).send({ message: 'File uploaded successfully!', url: publicUrl });
      } catch (err) {
        console.error('Error making file public:', err);
        res.status(500).send('File uploaded but failed to make it public.');
      }
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});