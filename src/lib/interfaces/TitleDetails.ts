import type { Writable } from "svelte/store";

export interface TitleDetailsData {
	Title: string;
	Year: string;
	Rated: string;
	Released: string;
	Runtime: string;
	Genre: string;
	Director: string;
	Writer: string;
	Actors: string;
	Plot: string;
	Language: string;
	Country: string;
	Awards: string;
	Poster: string;
	Ratings: Rating[];
	Metascore: string;
	imdbRating: string;
	imdbVotes: string;
	imdbID: string;
	Type: string;
	totalSeasons?: string;
	Response: string;
	Loading: boolean;
}

interface Rating {
	Source: string;
	Value: string;
}

export interface TitleDetails extends Writable<TitleDetailsData> {
	loadingTrue: () => void;
	loadingFalse: () => void;
	setData: (json: TitleDetailsData) => void;
	reset: () => void;
}