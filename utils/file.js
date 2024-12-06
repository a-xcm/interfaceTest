class File {
    constructor() {
        this.fs = require('fs');
    }
    // read file content
    readFile(filePath) {
        return this.fs.readFileSync(filePath, 'utf8');
    }
    // write file content
    writeFile(filePath, content) {
        this.fs.writeFileSync(filePath, content, 'utf8');
    }
    // delete file
    deleteFile(filePath) {
        this.fs.unlinkSync(filePath);
    }
    // check if file exists
    isFileExists(filePath) {
        return this.fs.existsSync(filePath);
    }
    //upload file
    uploadFile(filePath, file) {
        this.fs.writeFileSync(filePath, file);
    }
}
module.exports =new File();