import dotEnv from "dotenv";
dotEnv.config();
import { hideBin } from 'yargs/helpers';
import yargs from "yargs";
import chalk from "chalk";
import boxen from "boxen";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import WitApi from "node-wit";


console.log(chalk.blue(boxen('A CLI that helps you add subtitles to your videos', { padding: 1 })))

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

if(!args.i || args.l) {
    if(args.i) {
        if(!fs.existsSync(args.i)) {
            console.error(chalk.blue("File not found"));
        }
    }
}

ffmpeg(args.i)
.format('segment')
.outputOptions('-segment_time 20')
.output('./assets/audio/result-%d.mp3')
.run();


let files = fs.readdirSync('./assets/audio');
let regex = /^result-\d+\.mp3$/;
files = files.filter((file) => {
    return regex.test(file);
}).sort((a,b) => {
    const aNumber = parseInt(a.match(regex)[1], 10);
    const bNumber = parseInt(b.match(regex)[1], 10);
    return aNumber - bNumber;
});

/*
const fileStream = await fs.ReadStream("./assets/audio/result.mp3");
*/

/*
const witClient = new WitApi.Wit({
    accessToken: process.env.WIT_ACCESS_TOKEN
});


try {  
let result =  await witClient.dictation('audio/mpeg3', fileStream);
console.log(result);

} catch(exception) {
    console.log(exception);
}
*/
