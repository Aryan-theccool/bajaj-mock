# Bajaj Finserv Health & Salesforce Qualifier 1 REST API (Native HTTP)

This is a complete, deployable Node.js REST API project designed for the **Bajaj Finserv Health Backend and Salesforce Qualifier 1 API** challenges. 

It is built using Node.js's built-in `http` module (dependency-free) and runs locally on port **`3000`**. It is fully pre-configured to deploy on Vercel as a Serverless Function with zero configurations.

---

## 📁 Project Structure

```
bfhl-api/
├── api/
│   └── bfhl.js         # Unified serverless function & request handler (POST-only)
├── src/
│   ├── config.js       # Student credentials
│   └── logic.js        # Core helper functions, regexes, and response builders
├── server.js           # Local server using built-in Node.js http module (Port 3000)
├── test.js             # Local integration test suite (Runs on npm test)
├── package.json        # Lightweight dependency-free package setup
├── vercel.json         # Vercel endpoint routing rewrites
├── README.md           # Documentation
└── .gitignore          # Git exclusion lists
```

---

## ⚙️ How to Edit Details

Open [src/config.js](src/config.js) and insert your credentials:

```javascript
const USER = {
  fullName: "Aryan Singh Bhadoria",
  dob: "26072005",
  email: "aryansingh230477@acropolis.in",
  rollNumber: "0827CI231024",
};
```

User IDs are generated dynamically in the format: `lowercase_fullname_dob` (e.g. `aryan_singh_bhadoria_26072005`).

---

## 🚀 How to Install & Run

### 1. Installation
The project uses built-in Node.js modules, so it is **completely dependency-free** and doesn't require any package installation!
```bash
npm install
```

### 2. Run Local Server
Start the native HTTP server:
```bash
npm start
```
The server will start running locally at: **`http://localhost:3000`**

---

## 📡 Local Endpoint & Verification

*   **URL**: `http://localhost:3000/bfhl`
*   **Method**: `POST`
*   **Headers**: `Content-Type: application/json`

### cURL Verification Command:
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data":["A","1","334","4","R"]}'
```

*Expected JSON Response:*
```json
{
  "is_success": true,
  "user_id": "aryan_singh_bhadoria_26072005",
  "email": "aryansingh230477@acropolis.in",
  "roll_number": "0827CI231024",
  "numbers": ["1", "334", "4"],
  "alphabets": ["A", "R"]
}
```

---

## 🧪 Testing

We have built a dedicated test suite [test.js](test.js) to validate correctness of **Example A**, **Example B**, **Example C**, and empty/invalid body rejections.

To run the automated tests:
```bash
npm test
```

---

## ☁️ Vercel Deployment Steps

1. Push this project folder to your private/public **GitHub** repository.
2. Log into your [Vercel Dashboard](https://vercel.com).
3. Click **Add New** > **Project** and import your GitHub repository.
4. Keep all default configurations and click **Deploy**.
5. Once deployment is complete, submit your production endpoint:
   ```txt
   https://your-project-name.vercel.app/bfhl
   ```
