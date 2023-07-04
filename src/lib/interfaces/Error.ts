import type { Writable } from 'svelte/store';

export interface Error {
    Error: string,
    Response: string,
    Status: boolean // Potentially get rid of status, not needed as Response is either true or false, but it is a string
}

export interface ErrorWritable extends Writable<Error> {
    errorTrue: () => void;
    errorFalse: () => void;
    setData: (json: Error) => void;
}

export interface StreamingError {
    message: string;
}