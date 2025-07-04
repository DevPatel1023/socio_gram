import multer from 'multer';

// we use cloudinary so directly store it on memory buffer(ram)
const upload = multer(
    {
        storage: multer.memoryStorage(),
    }
)

export default upload;