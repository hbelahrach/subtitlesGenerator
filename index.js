import 'dotenv/config'
import * as fs from 'node:fs';
import chalk from 'chalk';
import boxen from 'boxen';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import WitApi from 'node-wit';
import { splitVideo, videoExists, getAudioFiles, generateSRT, cleanUpAudioFiles } from './videoHelper.js';
import { initProgressBar, updateProgressBar } from './progressBar.js';


const splitSize = 5;
const result = [];

console.log(chalk.blue(boxen('this command helps you generate subtitles for your videos', { padding: 1 })))
const args = yargs(hideBin(process.argv))
.option("i", {
    alias: "Input video",
    describe: "Input video to translate" 
})
.help()
.argv;

try {
    if(!args || !videoExists(args.i)) {
        throw new Error("Video doesnt exist");
    }

    const witClient = new WitApi.Wit({
        accessToken: process.env.WIT_ACCESS_TOKEN
    });

    console.log("Setting up the video");
    await splitVideo(args.i, splitSize);
    const files = getAudioFiles();
    initProgressBar(files.length);
    for(const file of files) {
        const fileStream = await fs.createReadStream(file);
        const response = await witClient.dictation('audio/mpeg3', fileStream);
        await sleep(250);
        await fileStream.close();
        result.push(response); 
        updateProgressBar();
    }
    generateSRT(result, splitSize, args.i);
    cleanUpAudioFiles();
} catch (error) {
    console.log(chalk.red(`--- ${error.message} ---`));
}

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            /* timeout to not get blocked by the API */
            resolve();
        }, time);
    });
}