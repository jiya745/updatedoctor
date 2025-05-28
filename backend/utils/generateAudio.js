import { exec } from "child_process";
import "dotenv/config"
import fs from "fs"
import path from "path";
const __dirname = path.resolve();


const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (filename,rubarbpath) => {
    const time = new Date().getTime();
    console.log(`Starting conversion for message ${filename}`);
    await execCommand(
      `ffmpeg -i audios/${filename}.mp3  -acodec pcm_s16le -ar 44100 audios/${filename}.wav`
      // -y to overwrite the file
    );
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);
    await execCommand(
      `${rubarbpath} -f json -o audios/${filename}.json audios/${filename}.wav -r phonetic`
    );
    await execCommand(
      `ffmpeg -i audios/${filename}.wav -codec:a libmp3lame -b:a 192k audios/${filename}-play.mp3`
    );
    console.log(`${rubarbpath} -f json -o audios/${filename}.json audios/${filename}.wav -r phonetic`)
    // -r phonetic is faster but less accurate
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);

    return {lip_sync: `audios/${filename}.json`,wav_file: `audios/${filename}.wav`,file_filename: `${filename}-play.mp3`};
  };

export async function getSpeakingData(text) {
    const url = "https://api.deepgram.com/v1/speak?model=aura-zeus-en&encoding=linear16&sample_rate=16000";
    const apiKey = process.env.DEEPGRAM_API_KEY;
    const data = { text };

    try {
        console.log("generating audio...");
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

       
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            return;
        }
        console.log("audio generated...");
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');
        const audioSrc = `data:audio/wav;base64,${base64Audio}`;

  
        // Save the file
        const filename = Date.now();
        const filepath = path.join(process.cwd(),'audios',`${filename}.mp3`);
        const rubarbpath = path.join(process.cwd(),process.env.MODE == "dev" ? '/bin/rhubarb': '/linux/rhubarb');
        fs.writeFileSync(filepath, Buffer.from(audioBuffer));
        const {lip_sync, wav_file,file_filename} = await lipSyncMessage(filename,rubarbpath);
        const lips_sync_data = JSON.parse(fs.readFileSync(lip_sync));
        // fs.unlinkSync(lip_sync)
        fs.unlinkSync(wav_file)
        fs.unlinkSync(filepath)
        return {data: lips_sync_data.mouthCues,src: file_filename};
    } catch (error) {
        console.error("Error:", error);
    }
}