export default interface IUser {
    displayName?: string | null,
    id?: string,
    email: string,
    uid: string,
    friends?: string[],
    name?: string,
    photoURL: string,
    startedChats?: string[]
}