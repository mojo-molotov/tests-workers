# Tests workers

## 1. OTP API for Parallel Testing

- [otp.ts](./api/otp.ts)
- [history.ts](./api/history.ts)

Naive Vercel Edge Function that generates TOTP codes for testing parallel browsers automation.

### Quirks

Returns ISO timestamps precise to seconds only (`.000Z`) to force proper concurrency handling in test frameworks.

### Deploy

→ `pnpm install`  
→ `vercel env add API_SECRET`  
→ `vercel env add UPSTASH_REDIS_REST_URL`  
→ `vercel env add UPSTASH_REDIS_REST_TOKEN`  
→ `vercel deploy`

### Usage

Generate an OTP:  
`curl -H "x-api-key: SECRET" "https://your-api.vercel.app/api/otp?secret={OTP_SECRET}"`

Retrieve OTP history:  
`curl -H "x-api-key: SECRET" "https://your-api.vercel.app/api/history"`

---

Built by [@mojo-molotov](https://github.com/mojo-molotov)  
Fueled by figatellu and Квас.

**This project is not affiliated with or endorsed by Vercel.**  
**Vercel is a trademark of Vercel Inc.**
