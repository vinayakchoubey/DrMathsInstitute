import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

let isConfigured = false;
let _storage: CloudinaryStorage | null = null;

function ensureCloudinaryConfig() {
    if (!isConfigured) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        isConfigured = true;
    }
}

export function getStorage(): CloudinaryStorage {
    if (!_storage) {
        ensureCloudinaryConfig();
        _storage = new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: 'drmaths',
                resource_type: 'auto',
            } as any,
        });
    }
    return _storage;
}

export default cloudinary;
