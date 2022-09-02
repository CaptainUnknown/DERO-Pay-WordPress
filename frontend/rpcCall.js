export const rpcCall = async (options) => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(new Error(`timeout`)), 5000)

    const { authenticator, method, params } = options

    const url = 'http://localhost:10103'

    const headers = {
      "Content-Type": "application/json",
    }

    headers["Authorization"] = "Basic " + btoa(`${authenticator}`)

    const body = {
      "jsonrpc": "2.0",
      "id": "1",
      "method": method
    }

    if (params) {
      body["params"] = params
    }

    const fetchUrl = new URL('json_rpc', url)
    const res = await fetch(fetchUrl, {
      method: "POST",
      mode: 'no-cors',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(`${authenticator}`)
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      return { data }
    } else {
      return { err: res.statusText || "Error" }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return { err: `Timeout` }
    }
    return { err: err.message }
  }
}
