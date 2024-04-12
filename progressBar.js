let total = 0;
let current = 0;
let totalDots = 20;

export const initProgressBar = (numberOfFiles) => {
    total =  numberOfFiles;
    updateProgressBar();
}

export const updateProgressBar = () => {
    const currentPercentage = Math.floor((current / total) * 100);
    const currentDots = Math.floor(currentPercentage * totalDots / 100);
    const dots = ".".repeat(currentDots);
    const left = totalDots - currentDots;
    const empty = " ".repeat(left)
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`\rGenerating subtitles: [${dots}${empty}] ${currentPercentage}%`);
    current++;
}