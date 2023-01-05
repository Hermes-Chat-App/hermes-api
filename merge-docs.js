import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { promisify } from 'util';
import deepMerge from 'deepmerge';

async function main() {
  const files = fs.readdirSync('api')
      .filter((file) => file !== 'base.yaml')
      .map((file) => path.join('api', file));

  const readFile = promisify(fs.readFile);

  const baseFilePath = path.join('api', 'base.yaml');


  // read basefile
  let merged = yaml.parse(fs.readFileSync(baseFilePath, 'utf8'));

  merged.paths = {};
  merged.components = {
    schemas: {},
    securitySchemes: {},
    examples: {},
    responses: {},
    parameters: {},
    requestBodies: {},
    ...merged.components,
  };
  merged.tags = [];

  // read all other files
  const apiData = await Promise.all(
      files.map((file) => readFile(file, 'utf8')));

  // merge each file
  for (const apiPartialRaw of apiData) {
    const apiPartial = yaml.parse(apiPartialRaw);
    merged = deepMerge(merged, apiPartial);
  }

  fs.writeFileSync('api.json', JSON.stringify(merged, null, 2));
}

main().catch(console.error);
