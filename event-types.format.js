const readline = require('readline');
const fs = require('fs');

const filePath = '/libs/stripe/src/lib/webhook/event-types.enum.ts';

const file = fs.readFileSync(filePath);

const data = file.toString();
const inputLines = data.split('\n');
const outputLines = [inputLines[0]];

for(let i = 1; i < inputLines.length; i++) {
  const inputLIne = inputLines[i].trim();
  if (inputLIne === '}') {
    outputLines.push(inputLIne);
    continue;
  }
  if (inputLIne.length === 0) {
    outputLines.push(`\t${inputLIne}`);
    continue;
  }
  if (inputLIne.startsWith('Occurs') || inputLIne.startsWith('Represents')) {
    const tmp = outputLines.pop();
    outputLines.push('\t/**');
    outputLines.push(`\t* ${inputLIne}`);
    outputLines.push('\t*/');
    outputLines.push(tmp);
    continue;
  }
  const chars = inputLIne.split('');
  const outputLine = [];
  for(let j = 0; j < chars.length; j++) {
    const char = chars[j];
    const pChar = chars[j-1];
    if (char === '_' || char === '.') {
      continue;
    }
    if (pChar === '_' || pChar === '.') {
      outputLine.push(char.toUpperCase());
    } else {
      outputLine.push(char);
    }
  }
  outputLines.push(`\t${outputLine.join('')} = '${inputLIne}',`);
}

const outputData = outputLines.join('\n');
fs.writeFileSync(filePath, outputData);
console.log();