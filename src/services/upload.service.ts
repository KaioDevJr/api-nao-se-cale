import { bucket } from './firebase.js';

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

/**
 * Uploads a file buffer from Multer to Google Cloud Storage.
 * @param file The file object from Multer (req.file).
 * @param destinationPath The folder path in the bucket (e.g., 'banners', 'reports').
 * @returns A promise that resolves with the public URL and storage path of the uploaded file.
 */
export function uploadFileToStorage(file: MulterFile, destinationPath: string): Promise<{ url: string; storagePath: string }> {
    if (!file) {
        throw new Error("No file provided for upload.");
    }
    if (!destinationPath) {
        throw new Error("Destination path in storage is required.");
    }

    const storagePath = `${destinationPath}/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(storagePath);

    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype,
        },
        resumable: false,
    });

    return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => reject(err));

        blobStream.on('finish', async () => {
            try {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve({ url: publicUrl, storagePath: blob.name });
            } catch (error) {
                reject(error);
            }
        });

        blobStream.end(file.buffer);
    });
}