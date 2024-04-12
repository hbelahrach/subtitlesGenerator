import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'node:fs';
import path from 'path';

const audioPath = "./assets/audio";

export const getVideoMetadata = (fileName) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fileName, ["-show_chapters"], (err, metadata) => {
            if(err) {
                reject(err);
            }
            resolve(metadata);
        })
    })
}

export const splitVideo = (fileName, splitSize = 10) => {
    splitSize = Math.max(splitSize, 20);
    return new Promise((resolve, reject) => {
        ffmpeg(fileName)
        .format('segment')
        .outputOptions('-segment_time ' + splitSize)
        .output(`${audioPath}/result-%d.mp3`)
        .on('end', () => {
            resolve();
        })
        .run();
    });
}

export const videoExists = (file) => {
    if(fs.existsSync(file)) {
        return true;
    }
    return false;
}

export const getAudioFiles = () => {
    let files = fs.readdirSync(audioPath);
    let regex = /result-(\d+)\.mp3/;
    files = files.filter((file) => {
        return regex.test(file);
    })
    .sort((a,b) => {
        const aNumber = parseInt(a.match(regex)[1], 10);
        const bNumber = parseInt(b.match(regex)[1], 10);
        return aNumber - bNumber;
    })
    .map((fileName) => {
        return path.join(audioPath, fileName);
    });
    return files;
}

function secondsToSRTTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const milliseconds = Math.round((remainingSeconds - Math.floor(remainingSeconds)) * 1000);

    const format = (num) => String(num).padStart(2, '0');
    return `${format(hours)}:${format(minutes)}:${format(Math.floor(remainingSeconds))},${String(milliseconds).padStart(3, '0')}`;
}

export const generateSRT = (entries, splitSize = 20, filePath) => {
    splitSize = Math.max(splitSize, 20);
    let result = '';
    let index = 1;
    let from = 0;
    let to = splitSize;
    const {dir, name} = path.parse(filePath);

    for(const entry of entries) {
        result += `${index}\n`;
        result += `${secondsToSRTTime(from)} --> ${secondsToSRTTime(to)}\n`;
        result += `${entry.text}\n\n`;
        index++;
        from += splitSize;
        to += splitSize
    }
    result = result.trim();
    fs.writeFile(`${dir}/${name}.srt`, result, 'utf8', function(err) {
        if (err) {
            throw new Error('Error saving the srt file');
        }
    });
}

export const cleanUpAudioFiles = () => {
    let files = fs.readdirSync(audioPath);

    for(const file of files) {
        const filePath = path.join(audioPath, file);
        fs.unlink(filePath, (err) => {
            if (err) {
              throw new Error("Error deleting audio file");
            }  
        });
    }
}