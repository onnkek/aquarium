import { IDate, IVacation } from "../redux/SettingsSlice"

const getNumber = (number: number) => (number < 10 ? `0${number}` : number)

export const getDeadline = (deadlineDate: string) => {
	const date = new Date(deadlineDate),
		day = date.getDate(),
		month = String(date.getMonth() + 1).padStart(2, "0"),
		year = date.getFullYear(),
		hour = getNumber(date.getHours()),
		minute = getNumber(date.getMinutes())
	return `${day}.${month}.${year} ${hour}:${minute}`
}

export const getDate = (deadlineDate: string) => {
	const deadline = Date.parse(deadlineDate)
	const currentTime = deadline - Date.now()
	let result = ""
	const hours = getNumber(Math.floor(currentTime / (1000 * 60 * 60))),
		minutes = getNumber(Math.floor((currentTime / (1000 * 60)) % 60)),
		seconds = getNumber(Math.floor((currentTime / 1000) % 60))
	result += Number(hours) > 0 ? `${hours}:` : "00:"
	result += Number(minutes) > 0 ? `${minutes}:` : "00:"
	result += Number(seconds) > 0 ? seconds : "00"
	return result
}

export const getProgress = (deadlineDate: string, createDate: string) => {
	const deadline = Date.parse(deadlineDate)
	const fullTime = deadline - Number(createDate)
	const currentTime = deadline - Date.now()
	if (currentTime < 0) {
		return 0
	}
	return (currentTime / fullTime) * 100
}

const getMonthCode = (number: number, year: number): number | undefined => {
	switch (number) {
		case 1:
			return isLeapYear(year) ? 0 : 1
		case 2:
			return isLeapYear(year) ? 3 : 4
		case 3:
			return 4
		case 4:
			return 0
		case 5:
			return 2
		case 6:
			return 5
		case 7:
			return 0
		case 8:
			return 3
		case 9:
			return 6
		case 10:
			return 1
		case 11:
			return 4
		case 12:
			return 6
		default:
			return undefined
	}
}

const isLeapYear = (year: number): boolean => {
	if (year % 4 === 0) {
		return true
	}
	return false
}

const isCentury6 = (number: number): boolean => {
	for (let i = 0; i <= number; i += 4) {
		if (i === number) {
			return true
		}
	}
	return false
}
const isCentury4 = (number: number): boolean => {
	for (let i = 1; i <= number; i += 4) {
		if (i === number) {
			return true
		}
	}
	return false
}
const isCentury2 = (number: number): boolean => {
	for (let i = 2; i <= number; i += 4) {
		if (i === number) {
			return true
		}
	}
	return false
}
const isCentury0 = (number: number): boolean => {
	for (let i = 3; i <= number; i += 4) {
		if (i === number) {
			return true
		}
	}
	return false
}

const getCenturyCode = (year: number): number | undefined => {
	const first = Number(year.toString().slice(0, 2))
	switch (true) {
		case isCentury6(first):
			return 6
		case isCentury4(first):
			return 4
		case isCentury2(first):
			return 2
		case isCentury0(first):
			return 0
		default:
			return undefined
	}
}

const getYearCode = (year: number): number | undefined => {
	const centuryCode = getCenturyCode(year)
	if (centuryCode) {
		return Math.trunc((centuryCode + Number(year.toString().slice(-2)) + Number(year.toString().slice(-2)) / 4) % 7)
	}
	return undefined
}

export const getDayCode = (day: number, month: number, year: number): number | undefined => {
	const monthCode = getMonthCode(month, year)
	const yearCode = getYearCode(year)
	if (monthCode !== undefined && yearCode !== undefined) {
		return (day + monthCode + yearCode) % 7
	}
	return undefined
}

export const getDaysInMonth = (year: number, month: number): number => {
	return (new Date(year, month, 0)).getDate()
}


export const getMonthName = (month: number): string => {
	const name = (new Date(`${month}.1.2024`)).toLocaleString('en-EN', { month: 'long' })
	return name.charAt(0).toUpperCase() + name.slice(1)
}

export const getNumberOfEmpty = (month: number, year: number): number | undefined => {
	const dayCode = getDayCode(1, month, year)
	const resCode = dayCode! + 5
	if (resCode >= 7) {
		return resCode - 7
	} else {
		return resCode
	}
}

export const getCalendarClasses = (settingsDate: IDate, date: string): string => {
	let classes = ""
	for (const holiday of settingsDate.holidays) {
		if (new Date(holiday.day).toDateString() === new Date(date).toDateString()) {
			classes += " holiday"
		}
	}
	for (const vacation of settingsDate.vacations) {
		if (new Date(vacation.start).toDateString() === new Date(date).toDateString()) {
			classes += " vacation-start"
		}
		if (new Date(vacation.end).toDateString() === new Date(date).toDateString()) {
			classes += " vacation-end"
		}
		if (new Date(vacation.end) > new Date(date) && new Date(vacation.start) < new Date(date)) {
			classes += " vacation"
		}
	}
	if (new Date(date).toDateString() === new Date().toDateString()) {
		classes += " current-day"
	}
	const isWorkingDays = settingsDate.workings.find(x => new Date(x.day).toDateString() === new Date(date).toDateString())
	if (settingsDate.weekend.highlight && !isWorkingDays) {
		const dayCode = getDayCode(new Date(date).getDate(), new Date(date).getMonth() + 1, new Date(date).getFullYear())
		if (dayCode === 0 || dayCode === 1) {
			classes += " weekend"
		}
	}
	return classes
}

export const getDaysBeforeVacation = (vacations: IVacation[]): number => {

	if (vacations.length) {
		const sorted = [...vacations].sort((vacation1, vacation2) => vacation1.start > vacation2.start ? 1 : -1)
		const vacationDate: any = new Date(sorted[0].start)
		const currentDate: any = new Date()
		return Math.round((vacationDate - currentDate) / 86400000)
	}
	return -1
}

export const getDaysBeforeNewYear = () => {
	const lastDay: any = new Date(`${new Date().getFullYear()}-12-31`)
	const current: any = new Date()
	return Math.round((lastDay - current) / 86400000)
}