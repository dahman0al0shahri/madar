const path = require('node:path');
const createBuildContext = require('../build/madar/context.cjs');
const buildNetworkSimulator = require('../build/madar/network-simulator.cjs');
const buildHub = require('../build/madar/hub.cjs');
const buildSharedAssets = require('../build/madar/shared-assets.cjs');

// Keep this entry point stable for local development, CI and hosting.
// Stages are ordered: the hub extends network output; shared assets finish home.
const context = createBuildContext(path.resolve(__dirname, '..'));
buildNetworkSimulator(context);
buildHub(context);
buildSharedAssets(context);
require('./build-srwe.cjs');
console.log('Built integrated MADAR pages and simulator');
