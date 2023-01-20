#!/usr/bin/node

import fs from 'fs';
import path from 'path';

const cache = "./.parcel-cache/";
const dist = "./dist/";
const modules = "./node_modules/";

function exists(path: string): boolean {
    var exists = true;
    fs.access(path, fs.constants.F_OK, _ => {
        exists = false;
    });
    return exists;
}

function getTargetPaths(projectRoot: string, target: string): string[] {
    let targets = getTargets(target);
    return targets.map((t) => path.join(projectRoot, t));
}

function getTargets(target: string): string[] {
    switch (target) {
        case "": return [dist];
        case "all": return [cache, dist, modules];
        case "cache": return [cache];
        case "dist": return [dist];
        case "modules": return [modules];
        default: return [];
    }
}

function rm(path: string): void {
    console.log('Removing "' + path + '"')
    if (exists(path)) fs.rm(path, { recursive: true, force: true }, err => {
        if (err) console.log(err);
    });
}

let scriptPath = process.argv[1];
let projectRoot = path.join(path.dirname(scriptPath), '..');
let target = process.argv[2] || "";
let paths = getTargetPaths(projectRoot, target);

for (let p of paths) rm(p);
