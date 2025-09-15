import fs from "fs-extra";

const unlinkAsync = (file: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(file, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

export default unlinkAsync;
