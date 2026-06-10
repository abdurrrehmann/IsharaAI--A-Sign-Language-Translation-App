const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Metro ko batayen ke .tflite files ko asset ke taur par bundle karna hai
config.resolver.assetExts.push("tflite");

module.exports = config;
