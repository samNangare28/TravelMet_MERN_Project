const fileToBase64 = (file) => {
    if (!file) return null;
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

module.exports = fileToBase64;