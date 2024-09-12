#!/usr/bin/env node

import { collectDependencies } from "./collect-dependencies";
import { readFileSync, writeFileSync } from "fs";
import yargs from "yargs";

(() => {
  const packageJson = JSON.parse(readFileSync("./package.json").toString());
  if (!packageJson.dependencies) {
    return;
  }

  const dependencies = collectDependencies(packageJson.dependencies);
  const thirdPartyLicensesString = JSON.stringify(dependencies);

  const args = yargs
    .command("* [options]", "A CLI tool for collecting and exporting third-party library licenses in JSON format")
    .options({
      outFilePath: {
        type: "string",
        describe: "path to output file\ne.g. './public/third-party-licenses.json'",
        demandOption: false,
      }
    })
    .parseSync();

  if (args.outFilePath) {
    writeFileSync(args.outFilePath, thirdPartyLicensesString);
  } else {
    console.log(thirdPartyLicensesString);
  }
})();
