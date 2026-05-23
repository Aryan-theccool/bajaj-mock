const http = require('http');
const url = require('url');
const bfhlHandler = require('./api/bfhl');

// Create native http server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Route: POST /bfhl or /api/bfhl
  if (parsedUrl.pathname === '/bfhl' || parsedUrl.pathname === '/api/bfhl') {
    let bodyChunks = [];
    
    req.on('data', (chunk) => {
      bodyChunks.push(chunk);
    });

    req.on('end', () => {
      const bodyString = Buffer.concat(bodyChunks).toString();
      
      if (bodyString) {
        try {
          req.body = JSON.parse(bodyString);
        } catch (e) {
          req.body = null;
        }
      } else {
        req.body = null;
      }

      // Delegate request handling to unified serverless handler
      bfhlHandler(req, res);
    });
  } else {
    // Basic root path for status checking
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        status: "healthy",
        message: "Bajaj Finserv Health Qualifier 1 API is running locally via native http module!",
        routes: {
          "POST /bfhl": "Processes raw input arrays"
        }
      }));
    }

    // Default Not Found route
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      is_success: false,
      message: "Not Found"
    }));
  }
});

// Expose on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Native http Server is running locally on http://localhost:${PORT}`);
  console.log(`- POST http://localhost:${PORT}/bfhl\n`);
});
