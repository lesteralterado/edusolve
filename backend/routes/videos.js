const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Video = require('../models/Video');

const router = express.Router();

// Configure multer for memory storage with limits
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// GET /api/videos - Get all videos with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }

    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/videos - Upload new video
router.post('/', upload.single('video'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Body:', req.body);
    console.log('File:', req.file ? 'present' : 'missing');
    if (req.file) {
      console.log('File size:', req.file.size);
      console.log('File mimetype:', req.file.mimetype);
    }

    const { title, description, duration, category, subcategory } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    // Upload video to Cloudinary with optimization
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'teacher-support-videos',
          public_id: `video_${Date.now()}`,
          // Video optimization settings
          quality: 'auto:best', // Automatic quality optimization
          // Removed invalid 'auto' parameters for format, codecs, bit_rate, fps, sampling
          // Compression and size optimization
          // Additional optimizations
          // Eager transformations for multiple resolutions
          eager: [
            {
              width: 1920,
              height: 1080,
              crop: 'limit',
              quality: 'auto:best',
              format: 'mp4',
              video_codec: 'h264',
              audio_codec: 'aac'
            },
            {
              width: 1280,
              height: 720,
              crop: 'limit',
              quality: 'auto:good',
              format: 'mp4',
              video_codec: 'h264',
              audio_codec: 'aac'
            },
            {
              width: 854,
              height: 480,
              crop: 'limit',
              quality: 'auto:eco',
              format: 'mp4',
              video_codec: 'h264',
              audio_codec: 'aac'
            }
          ],
          // Async processing for better performance
          eager_async: true,
          eager_notification_url: '', // Can be set for webhook notifications
          // CDN and caching optimizations
          invalidate: true,
          use_filename: false,
          unique_filename: true,
          // Resource optimization
          allowed_formats: ['mp4', 'webm', 'avi', 'mov', 'mkv'],
          moderation: 'manual' // Skip AI moderation for faster upload
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Create video document
    const video = new Video({
      title,
      description,
      duration,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      thumbnail: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/${result.public_id}.jpg`,
      category,
      subcategory
    });

    await video.save();
    res.status(201).json(video);
  } catch (error) {
    console.error('Error uploading video:', error);
    console.error('Error details:', error.message);
    if (error.http_code) {
      console.error('Cloudinary HTTP code:', error.http_code);
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// PUT /api/videos/:id/view - Increment view count
router.put('/:id/view', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ views: video.views });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/videos/:id - Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;