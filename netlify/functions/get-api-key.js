exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hasApiKey: !!process.env.GROQ_API_KEY,
      apiKey: process.env.GROQ_API_KEY || null
    }),
  };
};