import path from "node:path";
import fs from "node:fs";

class DirectoryManager {
  constructor(projectName, additionalDirs) {
    this.paths = new Map();
    this.#createDefaultPaths(projectName);
    this.tsConfigPath = this.#join(this.paths.get(projectName), "tsconfig.json");
    this.packageJsonPath = this.#join(this.paths.get(projectName), "package.json");
    if (additionalDirs) this.#handleAdditionalDirs(additionalDirs);
  }

  #addNewDirectory(parent, newDirectoryName) {
    const fullPath = this.#join(parent, newDirectoryName);  

    try {
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.paths.set(newDirectoryName, fullPath); 
        console.log(`Directory created: ${fullPath}`);
      } else {
        console.log(`Directory already exists: ${fullPath}`);
      }
    } catch (error) {
      console.error(`Error trying to add new directory: ${fullPath}`, error);
    }
  }

  #join(pD, newD) {
    return path.join(pD, newD);  
  }

  #createDefaultPaths(projectName) {
    const projectPath = path.join(process.cwd(), projectName);
    this.paths.set(projectName, projectPath); 

    this.#addNewDirectory(process.cwd(), projectName);  
    this.#addNewDirectory(projectPath, "src");  
    this.#addNewFile(this.paths.get("src"), "index.ts");
    this.#addNewDirectory(projectPath, "dist"); 
    this.#addNewFile(projectPath, ".env");
  }

  #addNewFile(PathToAdd, fileName) {
    try {
      fs.writeFileSync(this.#join(PathToAdd, fileName), "", "utf-8");
      console.log(`File created: ${this.#join(PathToAdd, fileName)}`);
    } catch (error) {
      console.error("Error trying to create new file: ", error);
      return;
    }
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

  #handleSubDirs(main, subdirs) {
    let folderPath;
    for(let i = 0; i < subdirs.length; i++) {
      if (subdirs[i].includes(".")) {
        if (folderPath) {
          console.log(`Creating file: ${subdirs[i]} in ${folderPath}!`);
          this.#addNewFile(folderPath, subdirs[i]);
        } else {
          console.log(`Creating file: ${subdirs[i]} in ${main}`);
          this.#addNewFile(main, subdirs[i]);
        }
      } else {
        this.#addNewDirectory(main, subdirs[i]);
        folderPath = this.paths.get(subdirs[i]);
      }
    }
  }
}

export { DirectoryManager };
