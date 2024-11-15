const fs = require('fs');
const path = require('path');

function deleteFilesInDirectory(directoryPath) {
    return fs.promises.readdir(directoryPath)
        .then(files => {
            // Loop through all items in the directory
            const promises = files.map(file => {
                const filePath = path.join(directoryPath, file);
                
                // Check if the item is a file or a directory
                return fs.promises.stat(filePath)
                    .then(stats => {
                        if (stats.isDirectory()) {
                            // If it's a directory, recursively delete its contents
                            return deleteFilesInDirectory(filePath)
                                .then(() => {
                                    // Remove the now-empty directory
                                    return fs.promises.rmdir(filePath);
                                });
                        } else {
                            // If it's a file, delete it
                            return fs.promises.unlink(filePath);
                        }
                    });
            });

            // Wait for all promises to complete (using Promise.all)
            return Promise.all(promises);
        })
        .then(() => {
            console.log(`All files in ${directoryPath} have been deleted.`);
        })
        .catch(error => {
            console.error('Error deleting files:', error);
        });
}

function mvFile(file, path) {
    return new Promise((resolve, reject) => {
    file.mv(path, (err) => {
        if (err) {
        return reject(err);
        }
        resolve();
    });
    });
};

module.exports = {deleteFilesInDirectory, mvFile}