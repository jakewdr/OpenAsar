const { join } = require('path');

global.log = (area, ...args) => console.log(`[\x1B[38;2;88;101;242mOpenAsar\x1B[0m > ${area}]`, ...args); // Make log global for easy usage everywhere

global.oaVersion = 'nightly';

log('Init', 'OpenAsar', oaVersion);
log('DEBUG2', '1');

if (process.resourcesPath.startsWith('/usr/lib/electron')) global.systemElectron = true; // Using system electron, flag for other places
process.resourcesPath = join(__dirname, '..'); // Force resourcesPath for system electron

const paths = require('./paths');
paths.init();

log('DEBUG2', '2');

global.settings = require('./appSettings').getSettings();
global.oaConfig = settings.get('openasar', {});

require('./cmdSwitches')();

log('DEBUG2', '3');

// Force u2QuickLoad (pre-"minified" ish)
const M = require('module'); // Module

const b = join(paths.getExeDir(), 'modules'); // Base dir
if (process.platform === 'win32') for (const m of require('fs').readdirSync(b)) M.globalPaths.push(join(b, m)); // For each module dir, add to globalPaths

log('DEBUG2', '4');

if (process.argv.includes('--overlay-host')) { // If overlay
  require('./utils/requireNative')('discord_overlay2', 'standalone_host.js'); // Start overlay
} else {
  require('./bootstrap')(); // Start bootstrap
}