"use strict";

var path = require('path');

var workingPath = path.dirname(require.main.filename);
var ROOT = process.env.ARTEFACT_PATH || workingPath;
var ENVIRONMENT = determineEnvironment();

console.log("Determined running in: " + ENVIRONMENT);
console.log("Root project path set as " + ROOT);

/*
 * To be valid packageJson,json must at the very least have
 * a name and a cloudformation field.
 */
console.log("Reading configuration from " + ROOT + "/package.json");
var packageJson = require(ROOT + "/package.json");

var SETTINGS = {
    rootDir: ROOT,
    artefactsFilename: "artifacts.zip",
    packageName: packageJson.name,
    cloudformation: packageJson.cloudformation || "cloudformation.json",
    buildStartTime: getDate(),
    projectBranchName: getBranchName() || "Unknown",
    manifestFile: "build.json",
    vcsURL: packageJson.repository.url || "Unknown",
    vcsRevision: getVcsRevision() || "Unknown",
    buildId: getBuildId() || "DEV",
    artefactBucket: "riffraff-artifact",
    manifestBucket: "riffraff-builds",
    targetDir: ROOT + "/target",
    leadDir: ROOT + "/target/riffraff",
    packageDir: ROOT + "/target/riffraff/packages/" + packageJson.name,
    buildDir: packageJson.buildDir || undefined,
    env: ENVIRONMENT
};

function getDate() {
    var date = new Date();
    return date.toISOString();
}

function determineEnvironment() {
    if (process.env.CIRCLECI && process.env.CI) {
        return "circle-ci";
    } else {
        return "dev";
    }
}

function getBranchName() {
    switch (ENVIRONMENT) {
        case 'circle-ci':
            return process.env.CIRCLE_BRANCH;

        default:
            return "dev";
    }
}

function getVcsRevision() {
    switch (ENVIRONMENT) {
        case 'circle-ci':
            return process.env.CIRCLE_SHA1;

        default:
            return "dev";
    }
}

function getBuildId() {
    switch (ENVIRONMENT) {
        case 'circle-ci':
            return process.env.CIRCLE_BUILD_NUM;

        default:
            return "dev";
    }
}

// build tool specific settings - currently only works for CIRCL_CI
console.log(SETTINGS);
exports.SETTINGS = SETTINGS;

//# sourceMappingURL=settings.js.map