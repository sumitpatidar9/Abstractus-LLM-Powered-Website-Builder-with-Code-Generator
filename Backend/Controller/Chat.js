import axios from 'axios'
import { Session } from '../Model/Session.js'
import env from 'dotenv';


env.config();


const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = process.env.GEMINI_API_URL


async function postChat(req, res) {
  const { prompt, sessionId } = req.body;
  const userId = req.user._id; // ✅ secured

  if (!prompt || !sessionId || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt and sessionId are required and must be valid', status: 'error' });
  }

  try {
//     const formattedPrompt = `
// You are a coding assistant that returns React components for live rendering in an iframe environment.

// 🔒 Your response must strictly be a **single JSON object**, **stringified using JSON.stringify()**, and must follow exactly this structure:

// {
//   "content": "A short plain-text explanation of the component (no markdown)",
//   "code": {
//     "jsxTsx": "React JSX or TSX code as a string. No import/export. Must include ReactDOM.render() with a full renderable component to document.getElementById('root')",
//     "css": "CSS styles for the component, as a plain string"
//   },
//   "previewState": {}
// }

// 🔁 JSX Example Format:
// function MyComponent(props) {
//   return (
//     <div className="my-box">
//       Hello, {props.name}
//     </div>
//   );
// }

// ReactDOM.render(
//   <MyComponent name="Alice" />,
//   document.getElementById('root')
// );

// 🎨 CSS Format:
// .my-box {
//   color: red;
//   font-weight: bold;
// }

// 🚫 Do not include:
// - Any import or export statements
// - Markdown, explanations, or code fencing (e.g. \`\`\`)
// - Comments inside JSX or CSS
// - Anything outside the JSON.stringify() object

// Prompt: ${prompt}
// `;


const formattedPrompt = `
You are a coding assistant returning React UI components for live rendering in an iframe.
🔒 Output must be a single JSON.stringify()-wrapped object with this exact structure:
{
  "content": "Short plain-text description (no markdown)",
  "code": {
    "jsxTsx": "Full React code (no imports/exports, must include ReactDOM.render() targeting 'root')",
    "css": "CSS as plain string"
  },
  "previewState": {}
}

🎯 Requirements:
- Center the component visually (both vertically and horizontally)
- Use realistic, styled UI elements (cards, navbars, forms, buttons, etc.)
- Include sufficient JSX + CSS to mimic a real interface block
- Avoid minimal examples — make it visually meaningful
- Do not include markdown, imports/exports, or comments
Prompt: ${prompt}
`;


    const geminiRes = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: formattedPrompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let text = geminiRes?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== 'string') throw new Error('Invalid or missing response from Gemini API');

    const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch) text = markdownMatch[1];

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const fallback = text.match(/\{[\s\S]*\}/);
      if (!fallback) return res.status(400).json({ error: 'Invalid Gemini response format', status: 'error' });
      try {
        parsed = JSON.parse(fallback[0]);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON structure from Gemini', status: 'error' });
      }
    }

    const formatted = {
      content: parsed.content || '',
      code: {
        jsxTsx: parsed.code?.jsxTsx || '',
        css: parsed.code?.css || ''
      },
      previewState: parsed.previewState || {}
    };

    await Session.findByIdAndUpdate(sessionId, {
      $push: {
        chatHistory: [
          { role: 'user', content: prompt },
          { role: 'ai', content: formatted.content, code: formatted.code, previewState: formatted.previewState }
        ]
      }
    });

    res.status(200).json({ status: 'ok', message: 'Chat updated successfully', data: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message, status: 'error' });
  }
}







export const createNewSession = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const newSession = new Session({
      userId,
      name: name || 'Untitled',
      chatHistory: [],
    });

    await newSession.save();

    res.status(201).json({ sessionId: newSession._id });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};


// Secure getChatHistory by extracting userId from req.user
async function getChatHistory(req, res) {
  const { sessionId } = req.body;
  const userId = req.user._id; // ✅ secured

  if (!sessionId || !userId) {
    return res.status(400).json({ error: 'sessionId and userId are required' });
  }

  try {
    const session = await Session.findById(sessionId);
    if (!session || String(session.userId) !== String(userId)) {
      return res.status(404).json({ error: 'Chat history not found' });
    }

    res.status(200).json({ status: 'ok', data: session.chatHistory });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}


async function getAllSessions(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({ userId: userId }, 'name createdAt').sort({ createdAt: -1 });
    res.status(200).json({ status: 'ok', data: sessions });
  }

  catch (error) {
    console.error('Error fetching all sessions:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message, status: 'error' });
  }
}


async function getSingleSession(req, res) {
  try {
    const userId = req.user._id;
    const sessionId = req.params.sessionId;
    const session = await Session.findOne({ _id: sessionId, userId: userId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found or does not belong to user', status: 'error' });
    }
    res.status(200).json({ status: 'ok', data: { chatHistory: session.chatHistory, name: session.name } });
  }

  catch (error) {
    console.error('Error fetching single session:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message, status: 'error' });
  }
}


export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('from delete session', id)
    const session = await Session.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete session' });
  }
};


export const updateSessionName = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name: newName },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ message: 'Session renamed successfully', session });
  } catch (err) {
    res.status(500).json({ message: 'Failed to rename session' });
  }
};



export { postChat, getChatHistory, getAllSessions, getSingleSession };


