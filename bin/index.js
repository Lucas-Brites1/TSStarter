#!/usr/bin/env node
import { program } from "commander";
import fs from "node:fs";
import { addScriptsToPackageJson } from "../src/scripts/scripts.js"; 
import { DirectoryManager } from "../src/filesystem/DirectoryManager.js"; 
import { DependenciesManager } from "../src/dependencies/DependencyManager.js";
import { configManager } from "../src/config/ConfigManager.js"; 

program.command("useTsconfig <PROJECTNAME> [PRESET] [DIRS...]")
  .alias("ts")
  .description("Create a new project Typescript with default presets.")
  .action((PROJECTNAME, PRESET, DIRS = []) => {
    try {
      const directoryMg = new DirectoryManager(PROJECTNAME, DIRS);
      fs.writeFileSync(directoryMg.tsConfigPath, JSON.stringify(configManager.tsconfigJSONConfig, null, 2));
      new DependenciesManager(PROJECTNAME, PRESET, addScriptsToPackageJson.bind(null, directoryMg.packageJsonPath, configManager.packageJsonConfig));
    } catch (error) {
      console.error(error);
      return;
    }
  });

program.parse(process.argv);
