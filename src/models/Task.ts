import { IBadge } from "./Badge"

export default interface ITask {
	id: number
	body: string
	create: string
	remove: string
	timeleft: string
	deadline: string
	link: string
	visible: boolean
	badges: IBadge[]
}