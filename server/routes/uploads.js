const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1 // Only allow one file at a time
  },
  fileFilter: fileFilter
});

// POST /api/upload/image - Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        message: 'Please select an image file to upload'
      });
    }

    // File validation passed, return file info
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileInfo
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it was uploaded but processing failed
    if (req.file) {
      const filePath = path.join(uploadDir, req.file.filename);
      fs.unlink(filePath, (unlinkError) => {
        if (unlinkError) console.error('Error cleaning up file:', unlinkError);
      });
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    }

    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while uploading the file'
    });
  }
});

// POST /api/upload/multiple - Upload multiple images (future feature)
router.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        error: 'No files uploaded',
        message: 'Please select at least one image file to upload'
      });
    }

    const filesInfo = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
      uploadedAt: new Date().toISOString()
    }));

    res.status(201).json({
      message: `${req.files.length} file(s) uploaded successfully`,
      files: filesInfo
    });

  } catch (error) {
    console.error('Multiple upload error:', error);
    
    // Clean up uploaded files if processing failed
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(uploadDir, file.filename);
        fs.unlink(filePath, (unlinkError) => {
          if (unlinkError) console.error('Error cleaning up file:', unlinkError);
        });
      });
    }

    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while uploading the files'
    });
  }
});

// DELETE /api/upload/:filename - Delete uploaded file
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename (prevent path traversal attacks)
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        error: 'Invalid filename',
        message: 'Filename contains invalid characters'
      });
    }

    const filePath = path.join(uploadDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The specified file does not exist'
      });
    }

    // Delete the file
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error('Error deleting file:', error);
        return res.status(500).json({
          error: 'Delete failed',
          message: 'An error occurred while deleting the file'
        });
      }

      res.json({
        message: 'File deleted successfully',
        filename: filename
      });
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'An error occurred while deleting the file'
    });
  }
});

// GET /api/upload/info/:filename - Get file information
router.get('/info/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        error: 'Invalid filename',
        message: 'Filename contains invalid characters'
      });
    }

    const filePath = path.join(uploadDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The specified file does not exist'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileInfo = {
      filename: filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      path: `/uploads/${filename}`
    };

    res.json(fileInfo);

  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({
      error: 'Failed to get file info',
      message: 'An error occurred while retrieving file information'
    });
  }
});

module.exports = router;