const { buildResponse } = require('../src/logic');

/**
 * Unified request handler for /bfhl.
 * Serves as both the Vercel Serverless Function and Express/Native HTTP request handler.
 */
module.exports = (req, res) => {
  // CORS Headers setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Support POST method only
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      is_success: false,
      message: `Method ${req.method} Not Allowed`
    }));
  }

  try {
    // Read the body content. Supporting standard pre-parsed JSON body (Vercel)
    // or fallback to parsing if passed as string.
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        body = null;
      }
    }

    const data = body ? body.data : null;

    // Validate body structure and 'data' array
    if (!data || !Array.isArray(data)) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(buildResponse(null, false)));
    }

    // Success response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(buildResponse(data, true)));
  } catch (error) {
    // Catch-all bad request fallback
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(buildResponse(null, false)));
  }
};
