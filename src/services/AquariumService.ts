import { IConfig, ITimeInfo } from "redux/AquariumSlice";
import { Doser, PidEvent, Relay } from "redux/EventsSlice";
import { LogCategory, LogEntry } from "redux/LogsSlice";
import { Point } from "redux/MetricsSlice";
import { INote } from "redux/NotesSlice";


export default class AquariumService {

  _apiBase: string
  _apiCurrent: string
  _apiConfig: string
  _apiSystemLogs: string
  _apiRelayLogs: string
  _apiDoserLogs: string
  _apiClearLogs: string
  _apiCO2: string
  _apiFilter: string
  _apiO2: string
  _apiLight: string
  _apiTemp: string
  _apiARGB: string
  _apiDoser: string
  _apiDateTime: string
  _apiMetrics: string
  _apiEvents: string
  _apiLogs: string
  _apiNotes: string
  _apiNote: string


  constructor() {
    this._apiBase = "http://192.168.1.110"
    this._apiConfig = "config"
    this._apiCurrent = "current"
    this._apiCO2 = "co2"
    this._apiFilter = "filter"
    this._apiO2 = "o2"
    this._apiLight = "light"
    this._apiTemp = "temp"
    this._apiARGB = "argb"
    this._apiDoser = "doser"
    this._apiDateTime = "time"
    this._apiSystemLogs = "system"
    this._apiRelayLogs = "relay"
    this._apiDoserLogs = "doser"
    this._apiClearLogs = "clear"
    this._apiMetrics = "api/metrics"
    this._apiEvents = "api/events"
    this._apiLogs = "api/logs"
    this._apiNotes = "notes"
    this._apiNote = "note"
  }


  getRelayEvents = async (params: {
    year: number
    month: number
  }) => {
    const url = new URL(`${this._apiBase}/api/events`)

    url.searchParams.append("type", "relay")
    url.searchParams.append("year", String(params.year))
    url.searchParams.append(
      "month",
      String(params.month).padStart(2, "0")
    )

    return await this.loadPagedText(url, {
      limit: 300,
      totalHeader: "X-Total-Records",
      headerRow: "ts,subtype,value\n"
    })
  }
  parseRelayCSV = (csv: string): Relay => {
    const TZ_OFFSET = 5 * 60 * 60 * 1000

    const result: Relay = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: []
    }

    csv
      .trim()
      .split("\n")
      .slice(1)
      .filter(Boolean)
      .forEach((line) => {
        const [ts, subtype, value] = line.split(",")

        const time = Number(ts) * 1000 - TZ_OFFSET
        const y = Number(value)

        const key = Number(subtype) as keyof Relay

        if (result[key]) {
          result[key].push({
            x: time,
            y
          })
        }
      })

    return result
  }
  getPidEvents = async (params: {
    year: number
    month: number
  }) => {
    const url = new URL(`${this._apiBase}/${this._apiEvents}`)

    url.searchParams.append("type", "pid")
    url.searchParams.append("year", String(params.year))
    url.searchParams.append(
      "month",
      String(params.month).padStart(2, "0")
    )

    return await this.loadPagedText(url, {
      limit: 300,
      totalHeader: "X-Total-Records",
      headerRow: "ts,subtype,value\n"
    })
  }
  parsePidCSV = (csv: string): PidEvent[] => {
    const TZ_OFFSET = 5 * 60 * 60 * 1000

    return csv
      .trim()
      .split("\n")
      .slice(1)
      .filter(Boolean)
      .map((line) => {
        const [ts, subtype, value] = line.split(",")

        const name: "COOL" | "HEAT" =
          subtype === "1" ? "COOL" : "HEAT"

        return {
          name,
          time: Number(ts) * 1000 - TZ_OFFSET,
          status: Number(value) as 0 | 1
        }
      })
      .sort((a, b) => a.time - b.time)
  }
  getLogs = async (params: {
    type: string
    year: number
    month: number
    day: number
  }) => {
    const url = new URL(
      `${this._apiBase}/${this._apiLogs}`
    )

    url.searchParams.append("type", params.type)
    url.searchParams.append("year", String(params.year))
    url.searchParams.append("month", String(params.month).padStart(2, "0"))
    url.searchParams.append("day", String(params.day).padStart(2, "0"))

    return await this.loadPagedLogText(url, {
      limit: 2048
    })
  }

  parseLogs = (
    text: string,
    category: LogCategory
  ): LogEntry[] => {
    return text
      .split("\n")
      .filter(Boolean)
      .map((line): LogEntry => {
        const match = line.match(
          /\[(.*?)\]\[(ERROR|WARN|INFO)\]:\s*(.*)/
        )

        if (!match) {
          return {
            type: "info",
            timestamp: "",
            category,
            message: line,
          }
        }

        const [, timestamp, level, message] = match

        const type =
          level === "ERROR"
            ? "error"
            : level === "WARN"
              ? "warning"
              : "info"

        return {
          type,
          timestamp,
          category,
          message,
        }
      })
  }
  getDoserEvents = async (params: {
    type: string
    year: number
    month: number
  }) => {
    const url = new URL(
      `${this._apiBase}/${this._apiEvents}`
    )

    url.searchParams.append("type", params.type)
    url.searchParams.append("year", String(params.year))
    url.searchParams.append(
      "month",
      String(params.month).padStart(2, "0")
    )

    return await this.loadPagedText(url, {
      limit: 300,
      totalHeader: "X-Total-Records",
      headerRow: "ts,subtype,value\n"
    })
  }
  parseDoserCSV = (csv: string): Doser => {
    const TZ_OFFSET = 5 * 60 * 60 * 1000

    const result: Doser = {
      1: [],
      2: [],
      3: [],
      4: []
    }

    csv
      .trim()
      .split("\n")
      .slice(1)
      .filter(Boolean)
      .forEach((line) => {
        const [ts, subtype, value] = line.split(",")

        const pump = Number(subtype) as 1 | 2 | 3 | 4

        if (!result[pump]) return

        result[pump].push({
          x: Number(ts) * 1000 - TZ_OFFSET,
          y: Number(value)
        })
      })

    return result
  }
  private async loadPagedText(
    baseUrl: URL,
    options?: {
      limit?: number
      totalHeader?: string
      headerRow?: string
    }
  ): Promise<string> {
    const limit = options?.limit ?? 300
    const totalHeader = options?.totalHeader ?? "X-Total-Records"
    const headerRow = options?.headerRow ?? ""

    let offset = 0
    let total = Infinity
    let result = ""

    while (offset < total) {
      const pageUrl = new URL(baseUrl.toString())
      pageUrl.searchParams.set("offset", String(offset))
      pageUrl.searchParams.set("limit", String(limit))

      console.log("[paged:req]", pageUrl.toString())

      const response = await fetch(pageUrl.toString(), {
        method: "GET"
      })

      console.log("[paged:status]", response.status)

      for (const [k, v] of response.headers.entries()) {
        console.log("[paged:header]", k, v)
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const totalValue = response.headers.get(totalHeader)
      console.log("[paged:totalHeader]", totalHeader, totalValue)

      if (!totalValue) {
        throw new Error(`Missing header: ${totalHeader}`)
      }

      total = Number(totalValue)
      console.log("[paged:offset/total]", offset, total)

      if (!Number.isFinite(total) || total < 0) {
        throw new Error(`Bad total header: ${totalValue}`)
      }

      const text = await response.text()
      console.log("[paged:text:length]", text.length)

      if (offset === 0) {
        result += text
      } else {
        let normalized = text

        if (headerRow && normalized.startsWith(headerRow)) {
          normalized = normalized.slice(headerRow.length)
        }

        result += normalized
      }

      offset += limit
      console.log("[paged:next-offset]", offset)

      if (text.trim() === "" || (headerRow && text.trim() === headerRow.trim())) {
        console.warn("[paged:break] empty page or header only")
        break
      }
    }

    console.log("[paged:done:length]", result.length)

    return result
  }

  private async loadPagedLogText(
    baseUrl: URL,
    options?: { limit?: number }
  ): Promise<string> {
    const limit = options?.limit ?? 2048

    let offset = 0
    let total = Infinity
    let result = ""

    while (offset < total) {
      const pageUrl = new URL(baseUrl.toString())
      pageUrl.searchParams.set("offset", String(offset))
      pageUrl.searchParams.set("limit", String(limit))

      const response = await fetch(pageUrl.toString(), {
        method: "GET"
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const totalValue = response.headers.get("X-Total-Bytes")
      if (!totalValue) {
        throw new Error("Missing header: X-Total-Bytes")
      }

      total = Number(totalValue)

      if (!Number.isFinite(total) || total < 0) {
        throw new Error(`Bad total bytes header: ${totalValue}`)
      }

      const text = await response.text()
      result += text

      offset += limit

      if (text.length === 0) {
        break
      }
    }

    return result
  }


  getMetrics = async (params: {
    metric: string
    year: number
    month: number
    day: number
  }) => {
    const url = new URL(
      `${this._apiBase}/${this._apiMetrics}`
    )

    url.searchParams.append("metric", params.metric)
    url.searchParams.append("year", String(params.year))
    url.searchParams.append(
      "month",
      String(params.month).padStart(2, "0")
    )
    url.searchParams.append(
      "day",
      String(params.day).padStart(2, "0")
    )

    return await this.loadPagedText(url, {
      limit: 300,
      totalHeader: "X-Total-Records",
      headerRow: "ts,value\n"
    })
  }

  parseMetricsCSV = (csv: string): Point[] => {
    const TZ_OFFSET = 5 * 60 * 60 * 1000

    return csv
      .trim()
      .split("\n")
      .slice(1)
      .filter(Boolean)
      .map((line) => {
        const [ts, value] = line.split(",")

        return {
          x: Number(ts) * 1000 - TZ_OFFSET,
          y: Number(value)
        }
      })
  }

  getNotes = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiNotes}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.json()
  }
  createNote = async (data: INote) => {
    const response = await fetch(`${this._apiBase}/${this._apiNote}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }
  updateNote = async (data: INote) => {
    const response = await fetch(`${this._apiBase}/${this._apiNote}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  deleteNote = async (uid: string) => {

    const url = new URL(
      `${this._apiBase}/${this._apiNote}`
    )
    url.searchParams.append("uid", uid)

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (!response.ok) {
      throw new Error("Failed to delete note")
    }
    return await response.json()
  }

  getCurrentInfo = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.json()
  }
  getConfig = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiConfig}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.json()
  }
  getSystemLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiSystemLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  getRelayLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiRelayLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  getDoserLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiDoserLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  clearSystemLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiClearLogs}/${this._apiSystemLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  clearRelayLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiClearLogs}/${this._apiRelayLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  clearDoserLogs = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiLogs}/${this._apiClearLogs}/${this._apiDoserLogs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    return await response.text()
  }
  updateDateTime = async (dateTime: ITimeInfo) => {
    const response = await fetch(`${this._apiBase}/${this._apiDateTime}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dateTime)
    })
    return await response
  }
  updateConfig = async (data: IConfig) => {
    const response = await fetch(`${this._apiBase}/${this._apiConfig}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }
  updateCO2 = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiCO2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateFilter = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiFilter}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateO2 = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiO2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateLight = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiLight}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateTemp = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiTemp}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }

  updateARGB = async (data: { status: boolean }) => {
    const response = await fetch(`${this._apiBase}/${this._apiCurrent}/${this._apiARGB}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    return await response
  }
}