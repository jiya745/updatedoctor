
export const BACKEND_URL = "http://localhost:4000" 


export const getResponse = async (message) => {
    const response = await fetch(`${BACKEND_URL}/chat?message=${message}`)
    const json = await response.json();
    return {src: `${BACKEND_URL}/${json.src}`,data: json.data, transcription: json.transcription};
}

