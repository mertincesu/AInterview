import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import FormData from 'form-data';

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

const OPENAI_API_KEY = 'sk-proj-16CuIRY9EaNcKvWEfWH0T3BlbkFJdFi9RqKr1iaghbc3tMrY';

app.post('/transcribe', async (req, res) => {
  const { audioData } = req.body;

  try {
    const form = new FormData();
    form.append('file', Buffer.from(audioData, 'base64'), {
      filename: 'audio.wav',
      contentType: 'audio/wav',
    });
    form.append('model', 'whisper-1');
    form.append('language', 'en');

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const transcript = response.data.text;
    console.log('Transcribed Text:', transcript);
    res.json({ transcript });
  } catch (error) {
    console.error('Error communicating with Whisper API:', error);
    res.status(500).send('Error transcribing audio.');
  }
});

app.post('/analyze', async (req, res) => {
  const { question, response: userResponse } = req.body;

  try {
    const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: `In 80 to 100 words, provide ONLY constructive but fair feedback (overall) acting as an interview tutor for this interview response. Question: "${question}" Response: "${userResponse}"`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const feedback = apiResponse.data.choices[0].message.content.trim();
    res.json({ feedback });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    console.error('Response Data:', error.response ? error.response.data : 'No response data');
    res.status(500).send('Error analyzing response.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
