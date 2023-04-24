import type { Writable } from 'svelte/store';

export interface Error {
    Error: string,
    Response: string,
    Status: boolean
}

export interface ErrorLoading extends Writable<Error> {
    errorTrue: () => void;
    errorFalse: () => void;
}