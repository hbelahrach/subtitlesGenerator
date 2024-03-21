import { hideBin } from 'yargs/helpers';
import yargs from "yargs";
import chalk from "chalk";
import boxen from "boxen";


const args = yargs(hideBin(process.argv))
.option("i", {
    alias: "Input video",
    describe: "Input video to translate" 
})
.option("l", {
    alias: "language",
    describe: "language to translate to, by default english" 
})
.help()
.argv;
console.log(chalk.blue(boxen('A CLI that helps you add subtitles to your videos', {padding: 1})))