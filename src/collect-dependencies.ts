import { execSync } from "child_process";
import { readFileSync } from "fs";
import { Dependency } from "./model/dependency";

export const collectDependencies = (projectDependencies: any): Dependency[] => {
  const dependencyNames = Object.keys(projectDependencies);

  const npmRoot = execSync('npm root').toString().trim();
  return dependencyNames.map((name): Dependency => {
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

    if (packageJson.homepage) {
      dependency.website = packageJson.homepage;
    }

    if (packageJson.repository?.url) {
      dependency.repository = packageJson.repository.url;
    }

    try {
      dependency.license = readFileSync(`${dependencyPath}/LICENSE`).toString();
    } catch { }

    return dependency;
  });
};
