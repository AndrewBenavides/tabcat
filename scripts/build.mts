#!/usr/bin/node

import { cp, readdir, stat } from 'fs/promises';
import { basename, extname, join, parse, resolve } from 'path';

const src = parse("./src/").base;
const dist = parse("./dist/").base;
const sourceFileExpressions = [
    /(d\.|m)?tsx?$/i,
    /html/i,
];

enum FileType {
    Directory = "Directory",
    File = "File",
    Other = "Other",
}

type FileInfo = {
    Name: string,
    Extension: string,
    Path: string,
    FullName: string,
    Type: FileType,
}

async function getFileInfo(path: string): Promise<FileInfo> {
    return {
        Name: basename(path),
        Extension: extname(path).substring(1),
        Path: path.toString(),
        FullName: resolve(path),
        Type: await getFileType(path),
    } as FileInfo;
}

async function getFileType(path: string): Promise<FileType> {
    let stats = await stat(path);
    if (stats.isDirectory()) return FileType.Directory;
    if (stats.isFile()) return FileType.File;
    return FileType.Other;
}

async function* enumeratePath(path?: string): AsyncIterable<FileInfo> {
    if (!path) return;
    let items = await readdir(path, { withFileTypes: true });
    for (let item of items) yield await getFileInfo(join(path, item.name));
}

async function* enumerateSubItems(item: FileInfo): AsyncIterable<FileInfo> {
    let subItems = item.Type == FileType.Directory ? enumeratePath(item.Path) : enumeratePath(undefined);
    for await (let subItem of subItems) {
        yield subItem;
        yield* enumerateSubItems(subItem);
    }
}

async function arrayFrom<T>(iterable: AsyncIterable<T>, filter?: (item: T) => boolean): Promise<T[]> {
    const noFilter = (_: T) => true;

    let arr: T[] = [];
    filter ??= noFilter;
    for await (let item of iterable) {
        if (filter(item)) arr.push(item);
    }
    return arr;
}

function isNotSourceFile(item: FileInfo): boolean {
    return !sourceFileExpressions.some(e => e.test(item.Path));
}

const item = await getFileInfo(src);
const subItems = enumerateSubItems(item);
const files = (await arrayFrom(subItems, isNotSourceFile))
    .map(file => file.Path);

for (let source of files) {
    const destination = source.replace(src, dist);
    await cp(source, destination, { force: true });
}
