const fs = require("fs");
const path = require("path");


const sourceFolders = [
  path.join(__dirname, "app", "pages"),
  path.join(__dirname, "app", "sidebar"),
];
const destinationFolder = path.join(__dirname, "component");


if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder);
}


const mergeFiles = (sources, destination) => {
  sources.forEach((source) => {
    fs.readdir(source, (err, files) => {
      if (err) {
        console.error(`Error reading folder ${source}:`, err);
        return;
      }

      files.forEach((file) => {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);

        
        fs.stat(sourcePath, (err, stats) => {
          if (err) {
            console.error("Error reading file stats:", err);
            return;
          }

          if (stats.isFile() && (file.endsWith(".js") || file.endsWith(".tsx"))) {
            
            fs.rename(sourcePath, destinationPath, (err) => {
              if (err) {
                console.error("Error moving file:", err);
              } else {
                console.log(`Moved: ${file}`);
              }
            });
          }
        });
      });
    });
  });
};


mergeFiles(sourceFolders, destinationFolder);
