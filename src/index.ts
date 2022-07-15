import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

const VERSION_REGEX = RegExp(/version:\s+(\d+\.\d+\.\d+\+\d+)/);

async function run(): Promise<void> {
  core.debug(process.cwd());
  if (
    !(
      fs.existsSync(path.join(process.cwd(), 'pubspec.yaml')) ||
      fs.existsSync(path.join(process.cwd(), 'pubspec.yml'))
    )
  ) {
    core.setFailed('pubspec file was not found');
    return;
  }

  let pubspecFileName = 'pubspec.yaml';
  if (fs.existsSync('pubspec.yml')) {
    pubspecFileName = 'pubspec.yml';
  }
  pubspecFileName = path.join(process.cwd(), pubspecFileName);

  core.debug(`using file: ${pubspecFileName}`);

  const result = fs.readFileSync(pubspecFileName, 'utf-8');
  const version = result.match(VERSION_REGEX);
  if (version === null) {
    core.setFailed('cannot find version');
  } else {
    core.debug(`version: ${version.at(1)}`);
    core.setOutput('version_raw', version.at(1));
    core.setOutput('version_semantic', `v${version.at(1)}`);
  }
}

run();
