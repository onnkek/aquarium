import { IBadge } from "../models/Badge"
import { INote } from "../models/Note"
import ITask from "../models/Task"
import { IHoliday, IVacation, IWeekend, IWorking } from "../redux/SettingsSlice"

export default class PlannerAPIService {
  _apiBase: string
  _apiTasks: string
  _apiBadges: string
  _apiNotes: string
  _apiSettings: string
  _apiWidgets: string

  constructor() {
    this._apiBase = "http://zavgorodinir.oduur.so:8000"
    this._apiTasks = "tasks"
    this._apiBadges = "badges"
    this._apiNotes = "notes"
    this._apiSettings = "settings"
    this._apiWidgets = "widgets"
  }

  getTasks = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiTasks}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return await response.json()
  }


  updateTask = async (id: number, data: { visible?: boolean, body?: string, deadline?: string }) => {
    const response = await fetch(`${this._apiBase}/${this._apiTasks}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  removeTask = async (id: number) => {
    const response = await fetch(`${this._apiBase}/${this._apiTasks}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response
  }

  addTask = async (data: ITask) => {
    const response = await fetch(`${this._apiBase}/${this._apiTasks}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  getBadges = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiBadges}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return await response.json()
  }

  addBadge = async (data: IBadge) => {
    const response = await fetch(`${this._apiBase}/${this._apiBadges}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  removeBadge = async (id: number) => {
    const response = await fetch(`${this._apiBase}/${this._apiBadges}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response
  }

  getNotes = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiNotes}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return await response.json()
  }
  updateNote = async (data: INote) => {
    const response = await fetch(`${this._apiBase}/${this._apiNotes}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  getSettings = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return await response.json()
  }

  addVacation = async (data: IVacation) => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}/vacations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  addWorking = async (data: IWorking) => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}/workings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  removeWorking = async (id: number) => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}/workings/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    return response
  }

  addHoliday = async (data: IHoliday) => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}/holidays`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  removeHoliday = async (id: number) => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}/holidays/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    return response
  }

  removeVacation = async (id: number) => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}/vacations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    return response
  }

  updateWeekend = async (data: IWeekend) => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}/weekend`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  updateSettings = async (data: any) => {
    const response = await fetch(`${this._apiBase}/${this._apiSettings}/weekend`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }

  getWidgets = async () => {
    const response = await fetch(`${this._apiBase}/${this._apiWidgets}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return await response.json()
  }

  updateWidgets = async (data: any) => {
    const response = await fetch(`${this._apiBase}/${this._apiWidgets}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    return response
  }
}
