const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, './output.txt');

const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Please enter text. Type "exit" or press Ctrl+C to quit.');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    exit();
  } else {
    writableStream.write(`${input}\n`);
  }
});

process.on('SIGINT', () => {
  exit();
});

function exit() {
  writableStream.end();
  rl.close();
  console.log('Thanks.');
  process.exit();
}