# health.js
Simple proactive health-checks using timestamps

1. prove an app is healthy: `health.js -p SERVICE_NAME`
2. check if an app is healthy: `health.js -c SERVICE_NAME MAX_SECONDS`

if MAX_SECONDS has passed, it will exit(1). thats it!


### API
`npm install thann/health.js`

```js
const health = require('health');
health.proveHealth('my-service');
console.log( health.checkHealth('my-service', 60) );
# 1.000000
```

