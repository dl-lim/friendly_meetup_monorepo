import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const envPath = join(__dirname, '..', '.env')

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim()
    }
  }
}

const { APPS_SCRIPT_URL, SIGNUP_SECRET } = process.env
const PORT = Number(process.env.PORT || 8080)
const ALLOWED_GROUPS = new Set(['fdm', 'fmaq'])
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

if (!APPS_SCRIPT_URL || !SIGNUP_SECRET) {
  console.error('Missing APPS_SCRIPT_URL or SIGNUP_SECRET')
  process.exit(1)
}

const clientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return String(forwarded).split(',')[0].trim()
  if (req.headers['x-real-ip']) return String(req.headers['x-real-ip']).trim()
  return req.socket.remoteAddress || ''
}

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 4096) {
        reject(new Error('Body too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

const serveFile = (res, filePath) => {
  const stream = createReadStream(filePath)
  stream.on('error', () => {
    res.writeHead(404)
    res.end()
  })
  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' })
  stream.pipe(res)
}

const serveStatic = (req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  const safePath = join(distDir, urlPath === '/' ? 'index.html' : urlPath)
  if (!safePath.startsWith(distDir)) {
    res.writeHead(403)
    res.end()
    return
  }
  if (existsSync(safePath) && statSync(safePath).isFile()) {
    serveFile(res, safePath)
    return
  }
  const index = join(distDir, 'index.html')
  if (existsSync(index)) serveFile(res, index)
  else {
    res.writeHead(404)
    res.end()
  }
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const APPS_SCRIPT_TIMEOUT_MS = 30000

const fetchTimeout = (url, options, ms = APPS_SCRIPT_TIMEOUT_MS) =>
  fetch(url, { ...options, signal: AbortSignal.timeout(ms) })

const parseJsonBody = (text) => {
  const trimmed = text.trim()
  if (trimmed.startsWith('{')) return JSON.parse(trimmed)
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1))
  throw new Error(`Apps Script returned non-JSON (${trimmed.slice(0, 80)})`)
}

// Apps Script runs doPost on the first POST and writes the row before returning 302.
// The redirect GET only fetches the JSON echo — skip it and respond as soon as POST finishes.
const callAppsScript = async (payload) => {
  const postRes = await fetchTimeout(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'manual',
  })

  if (REDIRECT_STATUSES.has(postRes.status)) {
    await postRes.arrayBuffer()
    return { ok: true }
  }

  const postText = await postRes.text()
  if (postRes.status === 200) return parseJsonBody(postText)

  throw new Error(`Apps Script POST status ${postRes.status}`)
}

createServer(async (req, res) => {
  if (req.url === '/api/signup' && req.method === 'POST') {
    if (req.headers['content-type'] !== 'application/json') {
      json(res, 415, { ok: false, error: 'Content-Type must be application/json' })
      return
    }
    try {
      const body = JSON.parse(await readBody(req))
      const name = String(body.name || '').trim()
      const email = String(body.email || '').trim()
      const groups = Array.isArray(body.groups)
        ? body.groups.filter((g) => ALLOWED_GROUPS.has(g))
        : []

      if (!name || !email) {
        json(res, 400, { ok: false, error: 'Name and email are required' })
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        json(res, 400, { ok: false, error: 'Invalid email' })
        return
      }
      if (!groups.length) {
        json(res, 400, { ok: false, error: 'Select at least one group' })
        return
      }

      const result = await callAppsScript({
        secret: SIGNUP_SECRET,
        name,
        email,
        groups,
        ip: clientIp(req),
      })
      if (!result.ok) {
        json(res, 502, { ok: false, error: result.error || 'Signup rejected' })
        return
      }
      json(res, 200, { ok: true })
    } catch (err) {
      console.error('Signup error:', err.message)
      json(res, 500, { ok: false, error: 'Signup failed' })
    }
    return
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    serveStatic(req, res)
    return
  }

  res.writeHead(405)
  res.end()
}).listen(PORT, () => {
  console.log(`Listening on :${PORT}`)
})
