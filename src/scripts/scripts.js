import fs from "node:fs";

const addScriptsToPackageJson = (PATH, SCRIPTS) => {
  try {
    const data = fs.readFileSync(PATH, "utf-8");
    const configs = JSON.parse(data);
    configs.scripts = {
      ...configs.scripts,
      ...SCRIPTS 
    };
    fs.writeFileSync(PATH, JSON.stringify(configs, null, 2));
    return true;
  } catch (err) {
    console.error("Error modifying package.json:", err);
    return false;
  }
};

export { addScriptsToPackageJson }; 