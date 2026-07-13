/**
 * FixIt Lens AI — Serverless Proxy Handler (Vercel / Netlify Function)
 * Deploys 100% FREE without any credit card or payment method required.
 * Securely proxies requests to Google Gemini 3.5 Flash without exposing GEMINI_API_KEY.
 */

export default async function handler(req, res) {
    // Enable CORS for frontend clients
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                error: 'Server configuration error: GEMINI_API_KEY environment variable missing.'
            });
        }

        const { image, mimeType, category, symptoms } = req.body;

        const promptText = `You are FixIt Lens AI, an expert electromechanical and hardware repair diagnostic assistant. Analyze the uploaded equipment photo (${category}). User Symptoms: "${symptoms || 'None provided'}".
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
        const payload = {
            contents: [
                {
                    parts: [
                        { text: promptText },
                        {
                            inline_data: {
                                mime_type: mimeType || 'image/jpeg',
                                data: image
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                response_mime_type: "application/json"
            }
        };

        const geminiRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const rawData = await geminiRes.json();
        const textOutput = rawData.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsedJson = JSON.parse(textOutput);

        return res.status(200).json(parsedJson);

    } catch (error) {
        return res.status(500).json({
            error: `Proxy Error: ${error.message}`
        });
    }
}
