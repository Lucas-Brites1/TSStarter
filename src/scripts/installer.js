import ora from "ora"; 
import chalk from "chalk";

class Installer {
  spinner;

  showText() {
    console.log("\n")
    this.spinner = ora(`${chalk.green.bold(`Installing`)}`).start(); 
    this.spinner.color = 'green';

    let dots = "";
    const interval = setInterval(() => {
      this.spinner.text = `${chalk.green.bold(`Installing`)}${chalk.green.italic(dots)}`; 
      dots += ".";
      if (dots.length > 3) {
        dots = ""; 
      }
    }, 400); 

    return interval;
  }

  succeed(message) {
    if (this.spinner) {
      this.spinner.succeed(`${chalk.green.bold.italic(message)}`);
    }
  }

  consoleTextColor(text, color, type) {
      console.log(chalk[color][type](text));
  }
}

export { Installer }; 
