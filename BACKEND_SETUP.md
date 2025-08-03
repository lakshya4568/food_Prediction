# NutriVision AI Backend Setup

This document provides setup instructions for the NutriVision AI backend, which uses the latest Google GenAI Python SDK for Gemini API integration.

## Quick Setup

1. **Run the setup script** (recommended):
   ```bash
   python setup_backend.py
   ```

2. **Manual setup** (alternative):
   ```bash
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env file with your API keys
   ```

## API Key Configuration

The backend uses the new unified Google GenAI SDK which supports multiple authentication methods:

### Environment Variables (Recommended)

Set one of these environment variables:

```bash
# New standard (preferred)
export GOOGLE_API_KEY="your_api_key_here"

# Legacy support
export GEMINI_API_KEY="your_api_key_here"
```

### Get Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key
4. Add it to your `.env` file

## Updated Features

### New Google GenAI SDK Integration

- **Automatic Model Detection**: Lists available Gemini models
- **Improved Error Handling**: Better API error reporting
- **JSON Response Mode**: Native JSON parsing support
- **Thinking Budget Control**: Faster responses with disabled thinking
- **Multiple Model Support**: Automatic fallback to available models

### New API Endpoints

#### Health Check with API Status
```
GET /health
```
Returns API configuration status and available models.

#### List Available Models
```
GET /api/models
```
Returns list of available Gemini models for your API key.

### Enhanced Health Analysis

The `/get_health_info` endpoint now features:
- **Smart Model Selection**: Automatically chooses the best available model
- **Improved JSON Parsing**: Better handling of Gemini responses
- **Performance Optimization**: Disabled thinking for faster responses
- **Better Error Handling**: More descriptive error messages

## Configuration Options

### Model Selection Priority

The system automatically selects models in this order:
1. `gemini-2.0-flash-001` (latest)
2. `gemini-2.0-flash`
3. `gemini-1.5-flash-001`
4. `gemini-1.5-flash`
5. `gemini-pro` (fallback)

### Response Configuration

```python
config=types.GenerateContentConfig(
    response_mime_type='application/json',
    temperature=0.3,
    max_output_tokens=1000,
    thinking_config=types.GenerationConfigThinkingConfig(
        thinking_budget=0,  # Disabled for speed
        include_thoughts=False
    )
)
```

## Running the Backend

```bash
# Development mode
python src/backend/app.py

# Production mode
export FLASK_ENV=production
python src/backend/app.py
```

The backend will run on `http://localhost:5002`

## Troubleshooting

### Import Errors

If you see `Import "google.genai" could not be resolved`:

1. Make sure you installed the new SDK:
   ```bash
   pip install google-genai>=0.2.0
   ```

2. **Remove old SDK** if installed:
   ```bash
   pip uninstall google-generativeai
   ```

### API Configuration Issues

1. **Check API key**: Visit `/health` endpoint
2. **Test models**: Visit `/api/models` endpoint
3. **Check environment**: Ensure `.env` file is loaded

### Common Issues

- **Old SDK conflicts**: Uninstall `google-generativeai` if present
- **Missing dependencies**: Run `pip install -r requirements.txt`
- **API key format**: Ensure no quotes or spaces in `.env` file

## Migration from Old SDK

If you're upgrading from the old `google-generativeai` package:

1. **Uninstall old package**:
   ```bash
   pip uninstall google-generativeai
   ```

2. **Install new package**:
   ```bash
   pip install google-genai>=0.2.0
   ```

3. **Update imports** in your code:
   ```python
   # Old way
   import google.generativeai as genai
   genai.configure(api_key="...")
   model = genai.GenerativeModel('gemini-pro')
   
   # New way
   from google import genai
   from google.genai import types
   client = genai.Client(api_key="...")
   response = client.models.generate_content(...)
   ```

## Environment Variables Reference

```bash
# Required
GOOGLE_API_KEY=your_google_api_key_here

# Optional
FLASK_DEBUG=true
FLASK_PORT=5002
REDIS_URL=redis://localhost:6379/0

# External APIs (optional)
USDA_API_KEY=your_usda_key
EDAMAM_APP_ID=your_edamam_id
EDAMAM_APP_KEY=your_edamam_key
```

## Testing the Setup

1. **Check health endpoint**:
   ```bash
   curl http://localhost:5002/health
   ```

2. **List available models**:
   ```bash
   curl http://localhost:5002/api/models
   ```

3. **Test food prediction**:
   ```bash
   curl -X POST http://localhost:5002/predict \
     -F "image=@path/to/food/image.jpg"
   ```

4. **Test health analysis**:
   ```bash
   curl -X POST http://localhost:5002/get_health_info \
     -H "Content-Type: application/json" \
     -d '{"food_name":"pizza","height":170,"weight":70,"bmi":24.2}'
   ```
