import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import fs from 'fs';

// Load environment variables
config();

console.log('Starting server...');
console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');

// Import mastra after basic setup
let mastra;
try {
  const mastraModule = await import('./dist/mastra/index.js');
  mastra = mastraModule.mastra;
  console.log('Mastra loaded successfully');
} catch (error) {
  console.error('Error loading Mastra:', error);
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Geçerli bir mesaj gönderilmedi' });
    }

    // Get the assistant agent
    const agent = mastra.getAgent('assistant');

    if (!agent) {
      return res.status(500).json({ error: 'Agent bulunamadı' });
    }

    // Generate response
    const result = await agent.generate(message);

    res.json({
      response: result.text,
      success: true
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      success: false
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// List available agents endpoint
app.get('/api/agents', (req, res) => {
  try {
    const agents = [
      {
        name: 'assistant',
        description: 'Türkçe konuşan yardımcı AI asistanı'
      }
    ];
    res.json({ agents });
  } catch (error) {
    console.error('Agents list error:', error);
    res.status(500).json({ error: 'Agent listesi alınamadı' });
  }
});

// Swagger JSON endpoint
app.get('/api/swagger.json', (req, res) => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));
    res.json(swaggerDoc);
  } catch (error) {
    console.error('Swagger doc error:', error);
    res.status(500).json({ error: 'Swagger dokümantasyonu yüklenemedi' });
  }
});

// Swagger UI endpoint
app.get('/api/docs', (req, res) => {
  const swaggerHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mastra AI Agent API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
        .swagger-ui .topbar {
            background-color: #667eea;
            background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .swagger-ui .topbar .download-url-wrapper {
            display: none;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/api/swagger.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                tryItOutEnabled: true,
                requestInterceptor: function(request) {
                    request.headers['Content-Type'] = 'application/json';
                    return request;
                }
            });
        };
    </script>
</body>
</html>`;
  res.send(swaggerHtml);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Web App: http://localhost:${PORT}`);
  console.log(`📚 API Docs (Swagger): http://localhost:${PORT}/api/docs`);
  console.log(`🔍 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Available Agents: http://localhost:${PORT}/api/agents`);
});
