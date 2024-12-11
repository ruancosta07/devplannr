export interface Message {
    title: string;
    text: string;
    type: "error" | "success";
}