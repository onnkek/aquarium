import {
  IAquariumConfig,
  IARGB,
  ICurrentInfo,
  IDoserConfig,
  IDoserStateItem,
  IRelay,
  IRelaysConfig,
  ISafetyInfo,
  ISystem,
  ITemp,
  ITimeInfo,
  RelaySubtype,
} from "redux/aquariumTypes";
import { Doser, PidEvent, Relay } from "redux/EventsSlice";
import { LogCategory, LogEntry } from "redux/LogsSlice";
import { Point } from "redux/MetricsSlice";
import { INote } from "redux/NotesSlice";

const DEFAULT_API_BASE = "http://localhost:3111";
const RELAY_KEYS: RelaySubtype[] = ["co2", "o2", "filter", "light"];

export default class AquariumService {
  private readonly apiBase: string;

  constructor() {
    this.apiBase = this.resolveApiBase();
  }

  private resolveApiBase(): string {
    const fromStorage = typeof window !== "undefined"
      ? window.localStorage.getItem("aquariumApiBase")
      : null;

    return (fromStorage || DEFAULT_API_BASE).replace(/\/$/, "");
  }

  private url(path: string): string {
    return `${this.apiBase}${path.startsWith("/") ? path : `/${path}`}`;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(this.url(path), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return (await response.text()) as T;
    }

    return await response.json();
  }

  private async raw(path: string, options: RequestInit = {}): Promise<Response> {
    return await fetch(this.url(path), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  }

  private async text(path: string, options: RequestInit = {}): Promise<string> {
    const response = await this.raw(path, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  }

  getCurrentInfo = async (): Promise<ICurrentInfo> => {
    const current = await this.request<ICurrentInfo>("/api/current");
    if (current.system?.time) {
      current.system.time.dayOfWeek = String(current.system.time.dayOfWeek ?? "");
    }
    return current;
  };

  getSafety = async (): Promise<ISafetyInfo> => {
    return await this.request<ISafetyInfo>("/api/safety");
  };

  enterEmergencyMode = async (): Promise<ISafetyInfo> => {
    await this.request<{ status?: string }>("/api/safety/emergency-mode", {
      method: "POST",
    });
    return await this.getSafety();
  };

  clearEmergencyMode = async (): Promise<ISafetyInfo> => {
    await this.request<{ status?: string }>("/api/safety/emergency-mode/clear", {
      method: "POST",
    });
    return await this.getSafety();
  };

  clearEmergencyOverride = async (): Promise<ISafetyInfo> => {
    await this.request<{ status?: string }>("/api/safety/emergency-override/clear", {
      method: "POST",
    });
    return await this.getSafety();
  };

  getSystemConfig = async (): Promise<ISystem> => {
    return await this.request<ISystem>("/api/system");
  };

  getDoserConfig = async (): Promise<IDoserConfig[]> => {
    return await this.request<IDoserConfig[]>("/api/doser");
  };

  getDoserState = async (): Promise<IDoserStateItem[]> => {
    return await this.request<IDoserStateItem[]>("/api/doser/state");
  };

  getDoserStateItem = async (index: number): Promise<IDoserStateItem> => {
    return await this.request<IDoserStateItem>(`/api/doser/${index}/state`);
  };

  getRelaysConfig = async (): Promise<IRelaysConfig> => {
    return await this.request<IRelaysConfig>("/api/relays");
  };

  getRelayConfig = async (subtype: RelaySubtype): Promise<IRelay> => {
    return await this.request<IRelay>(`/api/relays/${subtype}`);
  };

  getTempConfig = async (): Promise<ITemp> => {
    return await this.request<ITemp>("/api/temp");
  };

  getArgbConfig = async (): Promise<IARGB> => {
    return await this.request<IARGB>("/api/argb");
  };

  getConfig = async (): Promise<IAquariumConfig> => {
    const [system, doser, relays, temp, argb] = await Promise.all([
      this.getSystemConfig(),
      this.getDoserConfig(),
      this.getRelaysConfig(),
      this.getTempConfig(),
      this.getArgbConfig(),
    ]);

    return {
      system,
      doser,
      relays,
      temp,
      argb,
    };
  };

  updateSystemConfig = async (patch: Partial<ISystem>): Promise<ISystem> => {
    return await this.request<ISystem>("/api/system", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  };

  updateRelayConfig = async (subtype: RelaySubtype, patch: Partial<IRelay>): Promise<IRelay> => {
    return await this.request<IRelay>(`/api/relays/${subtype}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  };

  updateDoserConfig = async (index: number, patch: Partial<IDoserConfig>): Promise<IDoserConfig> => {
    return await this.request<IDoserConfig>(`/api/doser/${index}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  };

  updateTempConfig = async (patch: Partial<ITemp>): Promise<ITemp> => {
    return await this.request<ITemp>("/api/temp", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  };

  updateArgbConfig = async (patch: Partial<IARGB>): Promise<IARGB> => {
    return await this.request<IARGB>("/api/argb", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  };

  resetDoserLastRun = async (index: number): Promise<IDoserStateItem> => {
    await this.request<{ status?: string }>(`/api/doser/${index}/state/reset`, {
      method: "POST",
    });

    return await this.getDoserStateItem(index);
  };

  markDoserRunToday = async (index: number): Promise<IDoserStateItem> => {
    await this.request<{ status?: string }>(`/api/doser/${index}/state/mark-run`, {
      method: "POST",
    });

    return await this.getDoserStateItem(index);
  };

  updateDateTime = async (dateTime: ITimeInfo): Promise<Response> => {
    return await this.raw("/api/time", {
      method: "POST",
      body: JSON.stringify(dateTime),
    });
  };

  // Full import/export remains available for backup/debug only.
  exportFullConfig = async (): Promise<unknown> => {
    return await this.request("/api/config/export");
  };

  importFullConfig = async (data: unknown): Promise<Response> => {
    return await this.raw("/api/config/import", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  getRelayEvents = async (params: { year: number; month: number }) => {
    const url = new URL(this.url("/api/events"));
    url.searchParams.append("type", "relay");
    url.searchParams.append("year", String(params.year));
    url.searchParams.append("month", String(params.month).padStart(2, "0"));

    return await this.loadPagedText(url, {
      limit: 300,
      totalHeader: "X-Total-Records",
      headerRow: "ts,subtype,value\n",
    });
  };

  parseRelayCSV = (csv: string): Relay => {
    const TZ_OFFSET = 5 * 60 * 60 * 1000;
    const result: Relay = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    csv.trim().split("\n").slice(1).filter(Boolean).forEach((line) => {
      const [ts, subtype, value] = line.split(",");
      const key = Number(subtype) as keyof Relay;
      if (result[key]) {
        result[key].push({ x: Number(ts) * 1000 - TZ_OFFSET, y: Number(value) });
      }
    });

    return result;
  };

  getPidEvents = async (params: { year: number; month: number }) => {
    const url = new URL(this.url("/api/events"));
    url.searchParams.append("type", "pid");
    url.searchParams.append("year", String(params.year));
    url.searchParams.append("month", String(params.month).padStart(2, "0"));

    return await this.loadPagedText(url, {
      limit: 300,
      totalHeader: "X-Total-Records",
      headerRow: "ts,subtype,value\n",
    });
  };

  parsePidCSV = (csv: string): PidEvent[] => {
    const TZ_OFFSET = 5 * 60 * 60 * 1000;

    return csv.trim().split("\n").slice(1).filter(Boolean).map((line) => {
      const [ts, subtype, value] = line.split(",");
      const name: "COOL" | "HEAT" = subtype === "1" ? "COOL" : "HEAT";

      return {
        name,
        time: Number(ts) * 1000 - TZ_OFFSET,
        status: Number(value) as 0 | 1,
      };
    }).sort((a, b) => a.time - b.time);
  };

  getDoserEvents = async (params: { type: string; year: number; month: number }) => {
    const url = new URL(this.url("/api/events"));
    url.searchParams.append("type", params.type);
    url.searchParams.append("year", String(params.year));
    url.searchParams.append("month", String(params.month).padStart(2, "0"));

    return await this.loadPagedText(url, {
      limit: 300,
      totalHeader: "X-Total-Records",
      headerRow: "ts,subtype,value\n",
    });
  };

  parseDoserCSV = (csv: string): Doser => {
    const TZ_OFFSET = 5 * 60 * 60 * 1000;
    const result: Doser = { 1: [], 2: [], 3: [], 4: [] };

    csv.trim().split("\n").slice(1).filter(Boolean).forEach((line) => {
      const [ts, subtype, value] = line.split(",");
      const pump = Number(subtype) as 1 | 2 | 3 | 4;
      if (!result[pump]) return;
      result[pump].push({ x: Number(ts) * 1000 - TZ_OFFSET, y: Number(value) });
    });

    return result;
  };

  private async loadPagedText(
    baseUrl: URL,
    options?: { limit?: number; totalHeader?: string; headerRow?: string }
  ): Promise<string> {
    const limit = options?.limit ?? 300;
    const totalHeader = options?.totalHeader ?? "X-Total-Records";
    const headerRow = options?.headerRow ?? "";
    let offset = 0;
    let total = Infinity;
    let result = "";

    while (offset < total) {
      const pageUrl = new URL(baseUrl.toString());
      pageUrl.searchParams.set("offset", String(offset));
      pageUrl.searchParams.set("limit", String(limit));

      const response = await fetch(pageUrl.toString(), { method: "GET" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const totalValue = response.headers.get(totalHeader);
      if (!totalValue) throw new Error(`Missing header: ${totalHeader}`);
      total = Number(totalValue);
      if (!Number.isFinite(total) || total < 0) throw new Error(`Bad total header: ${totalValue}`);

      const text = await response.text();
      if (offset === 0) {
        result += text;
      } else {
        result += headerRow && text.startsWith(headerRow) ? text.slice(headerRow.length) : text;
      }

      offset += limit;
      if (text.trim() === "" || (headerRow && text.trim() === headerRow.trim())) break;
    }

    return result;
  }

  private async loadPagedLogText(baseUrl: URL, options?: { limit?: number }): Promise<string> {
    const limit = options?.limit ?? 2048;
    let offset = 0;
    let total = Infinity;
    let result = "";

    while (offset < total) {
      const pageUrl = new URL(baseUrl.toString());
      pageUrl.searchParams.set("offset", String(offset));
      pageUrl.searchParams.set("limit", String(limit));

      const response = await fetch(pageUrl.toString(), { method: "GET" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const totalValue = response.headers.get("X-Total-Bytes");
      if (!totalValue) throw new Error("Missing header: X-Total-Bytes");
      total = Number(totalValue);
      if (!Number.isFinite(total) || total < 0) throw new Error(`Bad total bytes header: ${totalValue}`);

      const text = await response.text();
      result += text;
      offset += limit;
      if (text.length === 0) break;
    }

    return result;
  }

  getMetrics = async (params: { metric: string; year: number; month: number; day: number }) => {
    const url = new URL(this.url("/api/metrics"));
    url.searchParams.append("metric", params.metric);
    url.searchParams.append("year", String(params.year));
    url.searchParams.append("month", String(params.month).padStart(2, "0"));
    url.searchParams.append("day", String(params.day).padStart(2, "0"));

    return await this.loadPagedText(url, {
      limit: 300,
      totalHeader: "X-Total-Records",
      headerRow: "ts,value\n",
    });
  };

  parseMetricsCSV = (csv: string): Point[] => {
    const TZ_OFFSET = 5 * 60 * 60 * 1000;

    return csv.trim().split("\n").slice(1).filter(Boolean).map((line) => {
      const [ts, value] = line.split(",");
      return { x: Number(ts) * 1000 - TZ_OFFSET, y: Number(value) };
    });
  };

  getLogs = async (params: { type: string; year: number; month: number; day: number }) => {
    const url = new URL(this.url("/api/logs"));
    url.searchParams.append("type", params.type);
    url.searchParams.append("year", String(params.year));
    url.searchParams.append("month", String(params.month).padStart(2, "0"));
    url.searchParams.append("day", String(params.day).padStart(2, "0"));

    return await this.loadPagedLogText(url, { limit: 2048 });
  };

  parseLogs = (text: string, category: LogCategory): LogEntry[] => {
    return text.split("\n").filter(Boolean).map((line): LogEntry => {
      const match = line.match(/\[(.*?)\]\[(ERROR|WARN|INFO)\]:\s*(.*)/);
      if (!match) return { type: "info", timestamp: "", category, message: line };

      const [, timestamp, level, message] = match;
      const type = level === "ERROR" ? "error" : level === "WARN" ? "warning" : "info";
      return { type, timestamp, category, message };
    });
  };

  // Legacy AquariumSlice log methods kept for older imports.
  getSystemLogs = async () => await this.text("/api/logs?type=system");
  getRelayLogs = async () => await this.text("/api/logs?type=relay");
  getDoserLogs = async () => await this.text("/api/logs?type=doser");
  clearSystemLogs = async () => "";
  clearRelayLogs = async () => "";
  clearDoserLogs = async () => "";

  getNotes = async () => {
    return await this.request<INote[]>("/api/notes");
  };

  createNote = async (data: INote) => {
    return await this.raw("/api/note", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  updateNote = async (data: INote) => {
    return await this.raw("/api/note", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  deleteNote = async (uid: string) => {
    const url = new URL(this.url("/api/note"));
    url.searchParams.append("uid", uid);
    const response = await fetch(url.toString(), { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete note");
    return await response.json();
  };

  // Old names intentionally removed from slice usage, but kept to avoid accidental runtime breakage.
  updateConfig = async (data: IAquariumConfig) => this.importFullConfig(data);
  updateCO2 = async () => this.raw("/api/relays/co2/on", { method: "POST" });
  updateFilter = async () => this.raw("/api/relays/filter/on", { method: "POST" });
  updateO2 = async () => this.raw("/api/relays/o2/on", { method: "POST" });
  updateLight = async () => this.raw("/api/relays/light/on", { method: "POST" });
  updateTemp = async () => this.raw("/api/temp", { method: "PATCH", body: "{}" });
  updateARGB = async () => this.raw("/api/argb", { method: "PATCH", body: "{}" });
}
