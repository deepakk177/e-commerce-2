import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * Upload image to Cloudinary
 * POST /api/upload
 */
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: req.file.path,
                publicId: req.file.filename
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
});

export default router;
