// export const getChatbotResponse = async (prompt, sessionId, userId) => {
//   try {
//     const response = await fetch('http://localhost:5000/home/chat', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include', // ✅ Include credentials (cookies/session)
//       body: JSON.stringify({ prompt, sessionId, userId }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || 'Failed to fetch response from backend');
//     }

//     const result = await response.json();
//     return {
//       text: result.data.content,
//       reactCode: result.data.code.jsxTsx,
//       cssCode: result.data.code.css,
//     };
//   } catch (error) {
//     console.error('Error fetching chatbot response:', error);
//     return {
//       text: "Sorry, I'm having trouble connecting right now. Please try again later.",
//       reactCode: '',
//       cssCode: '',
//     };
//   }
// };

// export const getPreviousChats = async (sessionId, userId) => {
//   try {
//     const response = await fetch('http://localhost:5000/home/chat-history', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include', // ✅ Include credentials (cookies/session)
//       body: JSON.stringify({ sessionId, userId }),
//     });

//     if (!response.ok) throw new Error('Failed to fetch chat history');

//     const result = await response.json();

//     return result.data.map(entry => ({
//       text: entry.content,
//       sender: entry.role === 'user' ? 'user' : 'chatbot',
//       reactCode: entry.code?.jsxTsx || '',
//       cssCode: entry.code?.css || '',
//     }));
//   } catch (error) {
//     console.error('Error loading chat history:', error);
//     return [];
//   }
// };






const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getChatbotResponse = async (prompt, sessionId, userId) => {
  try {
    const response = await fetch(`${backendUrl}/home/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ prompt, sessionId, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch response from backend');
    }

    const result = await response.json();
    return {
      text: result.data.content,
      reactCode: result.data.code.jsxTsx,
      cssCode: result.data.code.css,
    };
  } catch (error) {
    console.error('Error fetching chatbot response:', error);
    return {
      text: "Sorry, I'm having trouble connecting right now. Please try again later.",
      reactCode: '',
      cssCode: '',
    };
  }
};

export const getPreviousChats = async (sessionId, userId) => {
  try {
    const response = await fetch(`${backendUrl}/home/chat-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ sessionId, userId }),
    });

    if (!response.ok) throw new Error('Failed to fetch chat history');

    const result = await response.json();

    return result.data.map(entry => ({
      text: entry.content,
      sender: entry.role === 'user' ? 'user' : 'chatbot',
      reactCode: entry.code?.jsxTsx || '',
      cssCode: entry.code?.css || '',
    }));
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};






