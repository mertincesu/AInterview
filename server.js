import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import FormData from 'form-data';
import multer from 'multer';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

const OPENAI_API_KEY = 'sk-proj-16CuIRY9EaNcKvWEfWH0T3BlbkFJdFi9RqKr1iaghbc3tMrY';

const upload = multer({ dest: 'uploads/' });

async function getTextFromPDF(path) {
  const doc = await getDocument(path).promise;
  const numPages = doc.numPages;
  let textContent = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    textContent += strings.join(' ');
  }

  return textContent;
}

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
          content: 'You are an expert in interview feedback.',
        },
        {
          role: 'user',
          content: `In 80 to 100 words, provide ONLY constructive but fair feedback (overall) for this interview response. Question: "${question}" Response: "${userResponse}"`,
        },
      ],
      max_tokens: 150,
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

app.post('/score', async (req, res) => {
  const { question, response: userResponse } = req.body;

  try {
    const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in interview feedback, especiall giving scores to responses.',
        },
        {
          role: 'user',
          content: `Provide a score out of 100 (where 0 is very bad, and 100 is almost perfect). Provide ONLY the score (numeric) and no other text (so no "score: " text etc. only the value) Question: "${question}" Response: "${userResponse}"`,
        },
      ],
      max_tokens: 5,
      temperature: 0.2,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const scoreFeedback = apiResponse.data.choices[0].message.content.trim();
    res.json({ scoreFeedback });
    console.log("Score: ", scoreFeedback);
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    console.error('Response Data:', error.response ? error.response.data : 'No response data');
    res.status(500).send('Error analyzing response.');
  }
});

app.post('/analyze-resume', upload.single('resume'), async (req, res) => {
  const { file } = req;
  const { field, level } = req.body;  // Get field and level from the request body

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const text = await getTextFromPDF(file.path);
    const questions = [];
    let prevQuestions = `You are an interviewer, conducting interviews for a ${field} job position at the ${level} level of experience.`;

    for (let i = 0; i < 5; i++) {
      if (questions.length > 0) {
        prevQuestions = `Previously generated questions: ${questions.join(' ')}.`;
      }

      const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an interviewer, conducting interviews for a ${field} job position at the ${level} level of experience. Based on the following resume text, field of interview, and experience level, generate a single unique interview question 
            (ONLY THE QUESTION NO OTHER TEXT like no Unique interview question: extention or anything similar) that wasn't asked before. If the field is a technical field, ask technical questions. For non-technical fields, make it non-technical and specific
            to the field. Ensure each question is unique and not repetitive. For example, if a challenge-related question was asked before, don't ask it again. Ensure the 
            questions vary in their focus areas and are interesting.`
          },
          {
            role: 'user',
            content: `Resume: ${text}, Field of Interview: ${field}, Level of Interview: ${level}. ${prevQuestions}`
          },
        ],
        max_tokens: 100,
        temperature: 0.9,
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const question = apiResponse.data.choices[0].message.content.trim();
      if (question && !questions.includes(question)) {
        questions.push(question);
      } else {
        i--;  // Retry if the question is blank or duplicate
      }
    }

    console.log('Generated Questions:', questions);
    res.json({ questions });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).send('Error analyzing resume.');
  }
});

app.post('/feedback', async (req, res) => {
  const { question, response: userResponse } = req.body;

  try {
    const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in interview feedback.',
        },
        {
          role: 'user',
          content: `In 80 to 100 words, provide ONLY constructive but fair feedback (overall) for this interview response. Question: "${question}" Response: "${userResponse}"`,
        },
      ],
      max_tokens: 150,
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

// Add sentiment analysis endpoint
app.post('/sentiment', async (req, res) => {
  const { text } = req.body;

  try {
    const apiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a sentiment analysis expert that knows the tone, mood and overall emotion of texts very well.',
        },
        {
          role: 'user',
          content: `Analyze the following text and provide the overall sentiment (0 to 100 where 100 is extremely prositive, 0 is extremely negative). Don't write anything else than the sentiment value, just provide the number itself no text or any "sentiment:" text. Text: "${text}"`,
        },
      ],
      max_tokens: 5,
      temperature: 0.1,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const sentimentAnalysis = apiResponse.data.choices[0].message.content.trim();
    console.log('Sentiment Analysis Result:', sentimentAnalysis);
    res.json({ sentimentAnalysis });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    console.error('Response Data:', error.response ? error.response.data : 'No response data');
    res.status(500).send('Error analyzing sentiment.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
