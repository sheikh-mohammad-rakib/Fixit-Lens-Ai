# FixIt Lens AI — Multimodal Hardware & Appliance Diagnostic Studio

**Hackathon Submission:** *Code with Gemini API: Build and ship apps with Gemini and Google Cloud*  
**Category Focus:** *Best Use of Gemini API* & *Best App Deployed on Google Cloud*

---

## 🚀 Short Project Description
**FixIt Lens AI** is an interactive, multimodal hardware and electromechanical diagnostic command center. Users upload a photo or capture a live webcam shot of any broken appliance, circuit board, HVAC component, or industrial machinery.

Powered by **Gemini 3.5 Flash Multimodal Vision** and strict **Structured JSON Schema**, FixIt Lens AI identifies the damaged component, assesses safety hazards, calculates repair vs. replacement costs, and generates an interactive, step-by-step repair roadmap complete with a **Hands-Free Voice Readout** assistant for technicians working with physical tools.

---

## ⚡ How the Gemini API Was Used
FixIt Lens AI leverages the cutting-edge capabilities of **`gemini-3.5-flash`**:
1. **Multimodal Visual Reasoning (`inline_data`):** Uploaded device images (`PNG`, `JPG`, `WEBP`) or live webcam snapshots are passed directly into `gemini-3.5-flash` alongside structured engineering context to detect burnt connectors, leaking valves, or scorched PCB traces.
2. **Structured JSON Output (`response_mime_type: "application/json"`):** Guarantees strict adherence to an engineering diagnostic schema (`deviceTitle`, `faultyComponent`, `urgencyLevel`, `safetyWarnings`, `repairSteps`, `toolsRequired`).
3. **Smart Hazard & Urgency Evaluation:** Classifies hardware issues into `SAFE`, `MODERATE`, or `CRITICAL HAZARD` categories to prevent electrical shock or thermal burns.

---

## 🌟 Key Features & Hackathon Highlights

### 1. ⚡ Instant Judge Evaluation (Live Test Photos & Demo Cases)
- **Live Test Photos Bar:** Built-in engineering sample photos (`damaged_gpu_connector_1783843865106.png` & `damaged_pcb_board_1783843893756.png`) with **"Load into Scanner"** buttons so judges can test real Gemini 3.5 Flash vision instantly.
- **1-Click Hackathon Demo Mode:** 3 pre-configured real-world diagnostic cases (*Overheating RTX 4090 GPU*, *Commercial Espresso Machine Boiler Leak*, *Fried Smart Home Controller PCB*).

### 2. 🎨 Futuristic Cyber Command Center & Day/Night Mode
- High-contrast Cyber Glassmorphism UI featuring laser scanning overlays, glowing status indicators, and an instant **Day Mode / Night Mode** theme switch.

### 3. 🔊 Technician Hands-Free Voice Readout (Web Speech API)
- Integrated voice assistant reads step-by-step repair instructions aloud so technicians don't have to touch a screen while holding soldering irons or wrenches.

### 4. 🛡️ Dual API Mode & Smart Static Fallback
- Supports **Option 1: Direct Client API Key** OR **Option 2: Serverless Proxy Endpoint (`/api/gemini`)**.
- **Smart Fallback:** Even if Option 2 is selected while previewing on static hosting (like VS Code Live Server `127.0.0.1:5500`), the app automatically detects the static host and falls back seamlessly so diagnostics always succeed!

---

## ☁️ Zero-Config Deployment Architecture

```
[ Frontend SPA ]             [ Serverless Proxy ]               [ Google Cloud ]
index.html / app.js   --->   api/gemini.js (Vercel/Netlify) ---> Gemini 3.5 Flash API
       |                                                               |
(Static Hosting or                                        (Multimodal Vision +
 Full-Stack Node/Vercel)                                   Structured JSON Output)
```

### 1-Click Deployment Options:
1. **Vercel / Netlify:** Import repository directly. Pre-configured `vercel.json` routes `/api/gemini` automatically.
2. **Node.js / Google Cloud Run / Render:** Uses included `package.json` + `server.js` (`npm start`).
3. **Static / GitHub Pages:** Push static files directly (`index.html`, `app.js`, `style.css`).

---

## 💻 Running Locally
1. Simply double-click **`index.html`** or serve via `http://127.0.0.1:5500`.
2. Click any **"Load into Scanner"** photo or **Hackathon Demo Card** to evaluate immediately!
