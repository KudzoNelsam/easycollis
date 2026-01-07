import { API_BASE_URL } from "./config"

export type RequestOptions = RequestInit & { query?: Record<string, string | number | boolean> }

function buildUrl(path: string, query?: Record<string, string | number | boolean>) {
  const url = new URL(path, API_BASE_URL)
  if (query) {
    Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, String(v)))
  }
  return url.toString()
}

async function parseResponse(res: Response) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return text
  }
}

export async function httpGet<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.query)
  const res = await fetch(url, { method: "GET", ...opts })
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  return parseResponse(res) as Promise<T>
}

export async function httpPost<T>(path: string, body?: unknown, opts: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.query)
  const res = await fetch(url, { method: "POST", body: body ? JSON.stringify(body) : undefined, headers: { "Content-Type": "application/json" }, ...opts })
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  return parseResponse(res) as Promise<T>
}

export async function httpPut<T>(path: string, body?: unknown, opts: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.query)
  const res = await fetch(url, { method: "PUT", body: body ? JSON.stringify(body) : undefined, headers: { "Content-Type": "application/json" }, ...opts })
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  return parseResponse(res) as Promise<T>
}

export async function httpDelete<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.query)
  const res = await fetch(url, { method: "DELETE", ...opts })
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  return parseResponse(res) as Promise<T>
}
