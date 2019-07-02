#!/usr/bin/env node
// Prove the health of a service by writing/reading a timestamp file

'use strict';
const os = require('os');
const fs = require('fs');
const path = require('path');
module.exports = {
  proveHealth(serviceName) {
    fs.writeFileSync(path.join(os.tmpdir(), `node-health-${serviceName}`), '');
  },
  checkHealth(serviceName, maxSeconds) {
    // prints seconds since last
    const secondsSinceLastProof = (
      (Date.now()
        - fs.statSync(path.join(os.tmpdir(),
                               `node-health-${serviceName}`)).mtimeMs
      ) / 1000 );
    console.log(secondsSinceLastProof);
    if (maxSeconds && parseInt(maxSeconds) < secondsSinceLastProof) {
      console.error('Max time exceded!');
      process.exit(1);
    }
  },
  usage() {
    return (
`Usage:
  ${path.basename(process.argv[1])} -p <service_name>               # Prove
  ${path.basename(process.argv[1])} -c <service_name> [max_seconds] # Check`);
  }
};

// Command-line interface
if (require.main === module) {
  if (!(process.argv[2] || process.argv[3])) {
    console.error(module.exports.usage());
    process.exit(2);
  } else if (process.argv[2] === '-c') { // Check
    module.exports.checkHealth(process.argv[3], process.argv[4]);
  } else if (process.argv[2] === '-p') { // Prove
    module.exports.proveHealth(process.argv[3]);
  } else {
    console.error(module.exports.usage());
    process.exit(3);
  }
}
