export enum Section {
    Presentation = "Taqdimot",
    Research = "Ilmiy ish",
    Thesis = "Tezis",
    Article = "Maqola",
    Independent = "Mustaqil ish",
    Search = "Qidiruv",
    TTS = "Nutq Sintezi",
    Video = "Video Yaratish",
}

export interface UploadedFile {
    name: string;
    type: string;
    data: string; // base64 encoded data URL
}

export interface FilterOptions {
    [key: string]: string | number | undefined;
}
