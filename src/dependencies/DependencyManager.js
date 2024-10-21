import { exec } from "node:child_process";
import readline from "node:readline";
import { Installer } from "../scripts/installer.js"; 

class DependenciesManager {
  #presets = {
    "api-express": {
      prod: ["dotenv", "express", "axios"],
      dev: ["typescript", "ts-node", "@types/node", "@types/express"]
    },
    "api-cache": {
      prod: ["redis"],
      dev: []
    },
    "api-cache-mongo": {
      prod: ["mongoose"],
      dev: []
    }
  };

  constructor(projectName, preset, addScriptFunction) {
    const validate = this.#validate(preset);
    validate.isValid
      ? this.#exec(projectName, this.#setDependencies(validate.preset), addScriptFunction)
      : console.error("Error trying to execute dependencies installer.");
  }

  #validate(preset) {
    preset = preset === undefined ? "default" : preset.toLowerCase();
    if (!(preset in this.#presets) && preset !== "default") {
      console.error(`Preset "${preset}" not found.`);
      return {
        isValid: false,
        preset: undefined
      };
    }

    if (preset === "default") {
      preset = "api-express";
    }

    return {
      isValid: true,
      preset
    };
  }

  #openDirInput() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question("Would you like to open the project directory? (Y/N) ", (response) => {
        response = response.trim().toLowerCase();
        rl.close();
        resolve(response[0] === "y");
      });
    });
  }

  #openDir(response, project) {
    if (response) {
      exec(`cd ${project} && code .`);
    }
  }

  #exec(projectName, dependencies, cb) {
    const installer  = new Installer();
    const interval = installer.showText();

    const prodDependencies = this.#presets[dependencies].prod.join(" ");
    const devDependencies = this.#presets[dependencies].dev.join(" ");
    const installCommand = `cd ${projectName} && npm init -y && npm i ${prodDependencies} && npm i -D ${devDependencies}`;

    exec(installCommand, async (error, stdout, stderr) => {
      process.stdout.write("\n");
      clearInterval(interval);
      installer.succeed("All dependencies were installed successfully!")
      this.#openDir(await this.#openDirInput(), projectName);

      if (error) {
        console.error(`Error trying to install dependencies: ${error.message}`);
        return false;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return false;
      }
      cb();
    });
  }

  #setDependencies(preset) {
    if (preset === "api-express") {
      return preset;
    } else if (preset === "api-cache") {
      return this.#presets["api-express"].prod.concat(this.#presets["api-cache"].prod);
    } else if (preset === "api-cache-mongo") {
      return this.#presets["api-express"].prod.concat(this.#presets["api-cache"].prod).concat(this.#presets["api-cache-mongo"].prod);
    } else {
      console.error(`Error while trying to set dependencies for installation.`);
      return null;
    }
  }
}

export { DependenciesManager }; 
