export const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
};

export const getFileExtension = (filename) => {
    return filename.split(".").pop();
};
