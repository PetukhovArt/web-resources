/**
 * script for renaming gzipped files for backend after vite build
 * make gzip files with original file names
 * run this script with terminal,  from directory where you place your build files
 * then transfer files to server
 */

const fs = require("fs");
const path = require("path");

// TODO: WARN! starts renaming from the current directory !
const dirPath = process.cwd();

// Function to rename files
function renameFiles(folderPath) {
   fs.readdir(folderPath, (err, files) => {
      if (err) throw err;

      files.forEach(file => {
         const oldFilePath = path.join(folderPath, file);
         const newFilePath = path.join(folderPath, file.replace(".gz", ""));

         // Check if the file still exists before renaming
         if (fs.existsSync(oldFilePath)) {
            fs.rename(oldFilePath, newFilePath, err => {
               // if (err) throw err;
               console.warn(`Renamed ${oldFilePath} to ${newFilePath}`);
            });
         }
      });
   });
}

// Recursive function to traverse subdirectories
function traverseDir(dirPath) {
   fs.readdir(dirPath, (err, items) => {
      if (err) throw err;

      items.forEach(item => {
         const itemPath = path.join(dirPath, item);

         fs.stat(itemPath, (err, stats) => {
            if (err) throw err;

            if (stats.isDirectory()) {
               traverseDir(itemPath);
            } else if (itemPath.endsWith(".gz")) {
               renameFiles(dirPath);
            }
         });
      });
   });
}

// Start traversing from the root directory
traverseDir(dirPath);
