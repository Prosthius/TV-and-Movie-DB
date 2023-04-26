import type { Writable } from 'svelte/store';

export interface ErrorData {
    Error: string,
    Response: string,
    Status: boolean,
}

export interface Error extends Writable<ErrorData> {
    errorTrue: () => void;
    errorFalse: () => void;
    setData: (json: ErrorData) => void;
}