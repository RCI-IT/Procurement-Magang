// pdfHandler.js
import { Request, Response } from 'express';
import path from "path"
import fs from "fs";

const mimeTypeMap: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const ServeCertificateFile = (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public/certificate', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const ext = path.extname(filename).toLowerCase();
  const mimeType = mimeTypeMap[ext] || 'application/octet-stream';

  // Atur agar file dibuka di browser, bukan diunduh
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  fs.createReadStream(filePath).pipe(res);
};

// export default ServeCertificateFile;
module.exports = ServeCertificateFile;
