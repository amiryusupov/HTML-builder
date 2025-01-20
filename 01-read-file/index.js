const { createReadStream } = require('fs');
const { stdout } = process;
const { resolve, basename } = require('path');

const pathToFile = resolve(__dirname, 'text.txt');
const sourceFileName = basename(pathToFile);

const read = () => {
  const readStream = createReadStream(pathToFile, { encoding: 'utf-8' });
  readStream.pipe(stdout);
  readStream.on('error', (error) => {
    throw new Error(`File ${sourceFileName} read operation failed. Error: ${error}`);
  });
};

read();