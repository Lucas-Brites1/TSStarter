import ora from "ora"; 
import chalk from "chalk";

class Installer {
  spinner;

  showText() {
    this.spinner = ora(`${chalk.green.bold(`Installing`)}`).start(); 
    let dots = "";
    const interval = setInterval(() => {
      this.spinner.color = 'green';
      this.spinner.text = `${chalk.green.bold(`Installing`)}${chalk.green.italic(dots)}`; 
      dots += ".";
      if (dots.length > 3) {
        dots = ""; 
      }
    }, 275); 
    return interval;
  }

  succeed(message) {
    this.spinner.succeed(`${chalk.green.bold.italic(message)}`);
  }
}

export { Installer }; 
