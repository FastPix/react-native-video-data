// Metro config that lets the demo consume the parent SDK via `file:..`
// without duplicating react / react-native (otherwise hooks would explode
// when the wrapped component and the host app reference different copies).

const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const parentRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Watch the parent SDK's src so edits show up without republishing.
config.watchFolders = [parentRoot];

// Resolve dependencies from the demo's node_modules first, then fall back
// to the parent SDK's node_modules. Single source of truth for react/RN.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(parentRoot, "node_modules"),
];

// Force a single copy of react / react-native — the parent's copies are
// blocked so the demo's versions are always used.
config.resolver.disableHierarchicalLookup = true;

// Honor package.json "exports" field. Required for @fastpix/video-data-core:
// its `main` points to a browser-only IIFE that exports nothing via CommonJS,
// while its `exports.require` points to the proper CJS build.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
