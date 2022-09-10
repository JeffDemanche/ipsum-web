import { readFileSync } from "fs";

const path = process.argv[2];

const data = readFileSync(path, { encoding: "utf-8" });

const object = JSON.parse(data);

console.log(object);
