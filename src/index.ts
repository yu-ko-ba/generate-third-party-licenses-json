#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { Dependency } from "model/dependency";

(() => {
  const packageJson = JSON.parse(readFileSync('./package.json').toString());
  if (!packageJson.dependencies) {
    return;
  }

  const dependencyNames = Object.keys(packageJson.dependencies);

  const npmRoot = execSync('npm root').toString().trim();
  const dependencies = dependencyNames.map((name): Dependency => {
    const dependencyPath = `${npmRoot}/${name}`;

    const packageJson = JSON.parse(readFileSync(`${dependencyPath}/package.json`).toString());
    const licenseName = packageJson.license as string;

    const dependency: Dependency = {
      name: name,
      licenseName: licenseName,
    };

    if (packageJson.description) {
      dependency.description = packageJson.description;
    }

    try {
      dependency.license = readFileSync(`${dependencyPath}/LICENSE`).toString();
    } catch { }

    return dependency;
  });

  console.log(JSON.stringify(dependencies));
})();
