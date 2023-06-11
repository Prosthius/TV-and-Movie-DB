import { IRequest } from "itty-router";

export interface Env {
	DB_URL: string;
}

export interface User extends IRequest {
	Firstname: string;
	Lastname: string;
}