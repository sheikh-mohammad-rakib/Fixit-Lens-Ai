/**
 * FixIt Lens AI — Optional Express Proxy Server
 * Can be run locally (`node server.js`) or deployed for free on Render.com (no credit card required).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
    // API Endpoint
    if (req.url === '/api/gemini' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const apiKey = process.env.GEMINI_API_KEY || '';
                const data = JSON.parse(body);

                if (!apiKey) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'GEMINI_API_KEY not set on server' }));
                    return;
                }

                const promptText = `You are FixIt Lens AI, an expert electromechanical and hardware repair diagnostic assistant. Analyze the uploaded equipment photo (${data.category}). User Symptoms: "${data.symptoms || 'None provided'}".
Return a STRICT JSON object matching exactly this JSON schema:
{
  "deviceTitle": "Name of device or machinery",
  "faultyComponent": "Specific component or part causing failure",
  "urgencyLevel": "SAFE or MODERATE or HAZARDOUS",
  "hazardLevel": "Brief safety risk summary",
  "repairRecommendation": "Estimated repair cost and action",
  "rootCause": "Detailed root cause technical explanation",
  "safetyWarnings": ["Safety rule 1", "Safety rule 2"],
  "repairSteps": [
    { "title": "Step 1 title", "detail": "Detailed action instructions" }
  ],
  "toolsRequired": ["Tool 1", "Tool 2"]
}`;

                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
                const fetchRes = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    { text: promptText },
                                    {
                                        inline_data: {
                                            mime_type: data.mimeType || 'image/jpeg',
                                            data: data.image
                                        }
                                    }
                                ]
                            }
                        ],
                        generationConfig: {
                            response_mime_type: "application/json"
                        }
                    })
                });

                const rawJson = await fetchRes.json();
                const textOutput = rawJson.candidates?.[0]?.content?.parts?.[0]?.text;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(textOutput);

            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // Static File Serving
    let reqUrl = req.url === '/' ? 'index.html' : req.url;
    if (reqUrl === '/favicon.ico') reqUrl = 'favicon.svg';
    let filePath = path.join(__dirname, reqUrl);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`FixIt Lens AI running at http://localhost:${PORT}`);
});
