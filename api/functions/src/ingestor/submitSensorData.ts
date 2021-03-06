// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import fs from 'fs';
import fetch, { RequestInit } from 'node-fetch';
import * as os from 'os';

const DELAY_IN_MILLISECONDS = 100;
const usage = 'usage: \n\tts-node submitFiles.ts machineID sensorID';

const ingestorBaseURL = process.env.INGESTOR_URL;
if (ingestorBaseURL === undefined) {
  console.error('No INGESTOR_URL environment variable found');
  process.exit(1);
}

if (process.argv.length < 4) {
  console.error(usage);
  process.exit(1);
}

const machineId = process.argv[2];
const sensorId = process.argv[3];

const currentDir = __dirname;
let directory = '';
const isWindows = os.platform() === 'win32';
if (isWindows) {
  directory = currentDir + '\\..\\..\\..\\inputData\\';
} else {
  directory = currentDir + '/../../../inputData/';
}

const filePaths = findDataFileNamesInDir(directory);
processAllFiles(filePaths);

// top-level script run-through ends here

function findDataFileNamesInDir(absoluteDir: string): string[] {
  const fileNamesArray: string[] = [];

  let i = 0;
  fs.readdirSync(absoluteDir).forEach((file) => {
    i += 1;
    fileNamesArray.push(absoluteDir + file);
  });
  console.log(i + ' files found');

  return fileNamesArray;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processAllFiles(filePaths: string[]) {
  for (let i = 0; i < filePaths.length; i++) {
    // delay for getting "real-time" data
    await delay(DELAY_IN_MILLISECONDS);

    await processInputDataFile(filePaths[i]);
  }
}

async function processInputDataFile(filePath: string) {
  let fileName = '';

  const filepathDelimeter = isWindows ? '\\' : '/';
  fileName = filePath.substr(
    filePath.lastIndexOf(filepathDelimeter) + 1,
    filePath.length - 1
  );

  const timestamp = timestampFromFilename(fileName);

  const fileBuffer = readInputDataFile(filePath);

  const options: RequestInit = {
    headers: {
      'Content-Type': 'text/csv',
      Timestamp: timestamp.toISOString(),
    },
    method: 'POST',
    body: fileBuffer,
  };
  const url = `${ingestorBaseURL}/machine/${machineId}/sensor/${sensorId}`;

  const response = await fetch(url, options);

  if (response.status === 200) {
    console.log('Successfully uploaded ' + fileName);
  } else {
    console.log(
      'Problem uploading file - Error ' +
        response.status +
        ': ' +
        response.statusText
    );
  }
}

function readInputDataFile(filePath: string): Buffer {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer;
}

function timestampFromFilename(timestampStr: string): Date {
  const splitDateString: string[] = timestampStr.split('.');

  const date: Date = new Date();
  date.setFullYear(Number(splitDateString[0]));
  date.setMonth(Number(splitDateString[1]));
  date.setDate(Number(splitDateString[2]));
  date.setHours(Number(splitDateString[3]));
  date.setMinutes(Number(splitDateString[4]));
  date.setSeconds(39);

  return date;
}
