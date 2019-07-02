#!/usr/bin/env node
// Prove the health of a service by writing/reading a timestamp file

'use strict';
const os = require('os');
const fs = require('fs');
const path = require('path');

class MaxTimeExceeded extends Error {
  constructor(got, max) {
    super();
    this.got = got;
    this.max = max;
    this.message = `HealthError: (${got}) > (${max})`;
  }
};

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
    if (maxSeconds && parseInt(maxSeconds) < secondsSinceLastProof) {
      throw new MaxTimeExceeded(secondsSinceLastProof, maxSeconds);
    }
    return secondsSinceLastProof;
  },
  usage() {
    return (
`Usage:
  ${path.basename(process.argv[1])} -p <service_name>               # Prove
  ${path.basename(process.argv[1])} -c <service_name> [max_seconds] # Check`);
  },
  MaxTimeExceeded: MaxTimeExceeded,
};

// Command-line interface
if (require.main === module) {
  if (!(process.argv[2] || process.argv[3])) {
    console.error(module.exports.usage());
    process.exit(2);
  } else if (process.argv[2] === '-c') { // Check
    try {
      const time = module.exports.checkHealth(process.argv[3], process.argv[4]);
      console.log(time);
    } catch(e) {
      if (e instanceof MaxTimeExceeded) {
        console.log(e.got);
        console.error('Max time exceeded!');
        process.exit(1);
      } else {
        throw e;
      }
    }
  } else if (process.argv[2] === '-p') { // Prove
    module.exports.proveHealth(process.argv[3]);
  } else {
    console.error(module.exports.usage());
    process.exit(3);
  }
}
