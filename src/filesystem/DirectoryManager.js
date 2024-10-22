import path from "node:path";
import fs from "node:fs";
import { Installer } from "../scripts/installer.js";

class DirectoryManager {
  #text = new Installer();
  
  constructor(projectName, additionalDirs) {
    this.paths = new Map();
    this.#createDefaultPaths(projectName);
    this.tsConfigPath = this.#join(this.paths.get(projectName), "tsconfig.json");
    this.packageJsonPath = this.#join(this.paths.get(projectName), "package.json");
    if (additionalDirs) this.#handleAdditionalDirs(additionalDirs);
  }

  #join(pD, newD) {
    return path.join(pD, newD);  
  }

  #addNewDirectory(parent, newDirectoryName) {
    const fullPath = this.#join(parent, newDirectoryName);  
    try {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.paths.set(newDirectoryName, fullPath); 
        this.#text.consoleTextColor(`Directory created: ${fullPath}`, "green", "bold");
      } else {
        this.#text.consoleTextColor(`Warning: Directory already exists: ${fullPath}`, "yellow", "italic");
      }
    } catch (error) {
      this.#text.consoleTextColor(`Error creating directory: ${fullPath}`, "red", "bold");
    }
  }

  #addNewFile(PathToAdd, fileName) {
    try {
      fs.writeFileSync(this.#join(PathToAdd, fileName), "", "utf-8");
      this.#text.consoleTextColor(`File created: ${this.#join(PathToAdd, fileName)}`, "blue", "italic");
    } catch (error) {
      this.#text.consoleTextColor(`Error creating file: ${fileName}`, "red", "bold");
      return;
    }
  }
  
  #createDefaultPaths(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    this.paths.set(projectName, projectPath); 

    this.#addNewDirectory(process.cwd(), projectName);  
    this.#addNewDirectory(projectPath, "src");  
    this.#addNewFile(this.paths.get("src"), "index.ts");
    this.#addNewDirectory(projectPath, "dist"); 
    this.#addNewFile(projectPath, ".env");
    this.#addNewFile(projectPath, ".gitignore");
    fs.writeFileSync(this.#join(projectPath, ".gitignore"), "node_modules/", "utf-8")
  }

  #handleAdditionalDirs(listOfDirs) {
    this.#createNestedStructure(this.#createDirArray(listOfDirs));
  }

  #createDirArray(dirs) {
    const directories = String(dirs).split(",");
    const result = [];

    for (let i = 0; i < directories.length; i++) {
      if (directories[i].includes("+")) {
        let dirs = directories[i].split("+");
        let main = dirs[0];
        dirs = dirs.slice(1);
        result.push([main, dirs]); 
      } else {
        result.push([directories[i]]); 
      }
    }
    return result;
  }

  #handleSubDirs(main, subdirs) {
    let folderPath;
    for(let i = 0; i < subdirs.length; i++) {
      if (subdirs[i].includes(".")) {
        if (folderPath) {
          this.#text.consoleTextColor(`Creating file: ${subdirs[i]} in ${folderPath}`, "cyan", "italic");
          this.#addNewFile(folderPath, subdirs[i]);
        } else {
          this.#text.consoleTextColor(`Creating file: ${subdirs[i]} in ${main}`, "cyan", "italic");
          this.#addNewFile(main, subdirs[i]);
        }
      } else {
        this.#addNewDirectory(main, subdirs[i]);
        folderPath = this.paths.get(subdirs[i]);
      }
    }
  }

  #createNestedStructure(arrayDirs) {
    for(let i = 0; i < arrayDirs.length; i++) {
      const current = arrayDirs[i];
      if (current.length === 2) {
        const main = current[0];
        this.#addNewDirectory(this.paths.get("src"), main);
        const subs = current[1];
        this.#handleSubDirs(this.paths.get(main), subs);
      } else {
        if (current[0].includes(".")) {
          this.#addNewFile(this.paths.get("src"), current[0]);
        } else {
          this.#addNewDirectory(this.paths.get("src"), current[0]);
        }
      }
    }
  }
}

export { DirectoryManager };
