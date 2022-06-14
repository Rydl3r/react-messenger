import IMessage from "./IMessage";

export default interface IChat {
  cid?: string;
  participants: string[];
  content: IMessage[];
}
