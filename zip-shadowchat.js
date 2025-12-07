// save as zip-shadowchat.js in ~/shadowchat
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

// Project root
const projectRoot = path.resolve('.');
const outputZip = path.resolve(projectRoot, 'shadowchat_full_backup.zip');

const output = fs.createWriteStream(outputZip);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

output.on('close', () => {
  console.log(`✅ ShadowChat backup created: ${outputZip} (${archive.pointer()} total bytes)`);
});

archive.on('warning', err => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', err => {
  throw err;
});

archive.pipe(output);

// Include all files and folders in the project root
archive.glob('**/*', {
  cwd: projectRoot,
  dot: true, // include hidden files
  ignore: ['node_modules/**', '.git/**', '*.zip'] // exclude unwanted folders/files
});

archive.finalize();
