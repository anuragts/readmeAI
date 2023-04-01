import { config } from 'dotenv'
config();
import { Configuration, OpenAIApi } from "openai";

// load environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create configuration
const openAi = new OpenAIApi(
    new Configuration({
        apiKey: OPENAI_API_KEY,
    })
);

export { openAi };