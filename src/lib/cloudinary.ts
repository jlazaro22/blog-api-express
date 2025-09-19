import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from 'src/config';
import { logger } from './winston';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production',
});

export default function uploadToCloudinary(
  buffer: Buffer<ArrayBufferLike>,
  // publicId?: string,
): Promise<UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          resource_type: 'image',
          folder: 'blog-api',
          // public_id: publicId,
          transformation: { quality: 'auto' },
        },
        (err, result) => {
          if (err) {
            logger.error('Error uploading image to Cloudinary.', err);

            reject(err);
          }

          resolve(result);
        },
      )
      .end(buffer);
  });
}
