const sh = require('shelljs');
const upath = require('upath');

const sourcePath = upath.resolve(upath.dirname(__filename), '../dist');
const destPath = upath.resolve(upath.dirname(__filename), 'Q:\\Blood on the Clocktower\\botc.d5l.de\\beta');

if (sh.test('-d', destPath)) {
    sh.rm('-rf', `${destPath}/*`);
    sh.mkdir('-p', destPath);
    sh.cp('-R', `${sourcePath}/*`, destPath);
} else {
    console.error(`path not found: ${destPath}`);
}
