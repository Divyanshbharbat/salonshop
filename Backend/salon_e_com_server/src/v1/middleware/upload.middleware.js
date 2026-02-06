import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary, { isCloudinaryConfigured } from '../../config/cloudinary.js';

let upload;

if (isCloudinaryConfigured) {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'salon-products',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            transformation: [{ width: 800, height: 800, crop: 'limit' }]
        }
    });
    upload = multer({ storage: storage });
} else {
    // Fallback: use memory storage so requests with files don't crash, but files won't be uploaded.
    // This allows creating/updating products without image uploads when Cloudinary isn't configured.
    console.warn('[upload.middleware] Cloudinary not configured. Using memory storage fallback; uploaded files will not be persisted.');
    upload = multer({ storage: multer.memoryStorage() });
}

export default upload;
