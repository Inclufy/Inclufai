# ProjeXtPal API Documentation

## Base URLs

- **Production:** `https://projextpal.com/api/v1/`
- **Alternative:** `https://api.projextpal.com/api/v1/` (coming soon)

## Authentication

### JWT Authentication (Mobile/Web Apps)
```bash
# Login
curl -X POST https://projextpal.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}

# Use token
curl https://projextpal.com/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### API Key Authentication (Third-Party Integrations)

Contact support@projextpal.com to request an API key.
```bash
# Use API key
curl https://projextpal.com/api/v1/projects/ \
  -H "Api-Key: YOUR_API_KEY"
```

## Endpoints

### Authentication
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/register/` - Register
- `GET /api/v1/auth/user/` - Get current user
- `POST /api/v1/auth/token/refresh/` - Refresh JWT token

### Programs
- `GET /api/v1/programs/` - List programs
- `POST /api/v1/programs/` - Create program
- `GET /api/v1/programs/{id}/` - Get program details
- `PUT /api/v1/programs/{id}/` - Update program
- `DELETE /api/v1/programs/{id}/` - Delete program

### Projects
- `GET /api/v1/projects/` - List projects
- `POST /api/v1/projects/` - Create project
- `GET /api/v1/projects/{id}/` - Get project details
- `PUT /api/v1/projects/{id}/` - Update project
- `DELETE /api/v1/projects/{id}/` - Delete project

### Budget
- `GET /api/v1/projects/budget/` - List budgets
- `GET /api/v1/projects/budget/overview/` - Budget overview
- `GET /api/v1/projects/budget-categories/` - Budget categories
- `GET /api/v1/projects/budget-items/` - Budget items

### Time Tracking
- `GET /api/v1/projects/time-entries/` - List time entries
- `POST /api/v1/projects/time-entries/` - Create time entry

### Risks
- `GET /api/v1/projects/risks/` - List risks
- `POST /api/v1/projects/risks/` - Create risk

### AI Chat
- `POST /api/v1/bot/chats/` - Create chat session
- `POST /api/v1/bot/chats/{id}/send_message/` - Send message

## Example: Create Project
```bash
curl -X POST https://projextpal.com/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description",
    "methodology": "agile",
    "status": "planning",
    "budget": "50000.00",
    "start_date": "2026-02-01",
    "end_date": "2026-12-31"
  }'
```

## Response Format

### Success Response
```json
{
  "id": 1,
  "name": "My Project",
  "status": "planning",
  ...
}
```

### Error Response
```json
{
  "detail": "Authentication credentials were not provided."
}
```

## Rate Limits

- **Free tier:** 100 requests/hour
- **Pro tier:** 1000 requests/hour
- **Enterprise:** Unlimited

## Support

- **Email:** support@projextpal.com
- **Documentation:** https://docs.projextpal.com
- **API Status:** https://status.projextpal.com

## Changelog

### v1.0.0 (2026-01-26)
- Initial API release
- JWT authentication
- Programs & Projects endpoints
- Budget management
- Time tracking
- Risk management
- AI chat integration
