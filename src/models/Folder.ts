import { INote } from "./Note"

export default interface IFolder {
  uid: number
  label: string
  create: string
  icon: string
  children: (IFolder | INote)[]
}