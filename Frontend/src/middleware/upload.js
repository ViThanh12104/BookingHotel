import multer from "multer";

// lưu file vào memory
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage
});

export default upload;