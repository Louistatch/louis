// Runs the Node unit tests in-process on every supported Node release.
// The isolation flag was experimental in Node 22 and renamed in Node 23.6.
import {spawnSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
const [major,minor]=process.versions.node.split('.').map(Number);
const flag=major>23||(major===23&&minor>=6)?'--test-isolation=none':'--experimental-test-isolation=none';
const files=readdirSync(new URL('../tests',import.meta.url)).filter(f=>f.endsWith('.test.mjs')).map(f=>'tests/'+f);
const run=spawnSync(process.execPath,['--test',flag,...files],{stdio:'inherit',cwd:new URL('..',import.meta.url)});
process.exit(run.status??1);
