import { IRequest } from "itty-router";

export interface Env {
	DB_URL: string;
}

export interface User extends IRequest {
	Firstname: string;
	Lastname: string;
}

export interface Movie extends IRequest {
	ImdbID: string;
	Title: string;
	Year: number;
	PosterLink: string;
	PlotShort: string;
	DetailsLink: string;
	Genre: string;
	Runtime: number;
	Rewatch?: boolean;
	UserID: number;
}