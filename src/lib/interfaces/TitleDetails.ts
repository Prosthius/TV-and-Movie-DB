import type { Writable } from "svelte/store";

export interface TitleDetails {
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
	seriesID?: string;
	Type: string;
	totalSeasons?: string;
	Response: string;
	Error?: string;
	Loading: boolean;
	Episode?: string;
	Season: string;
	BoxOffice?: string;
}

interface Rating {
	Source: string;
	Value: string;
}

export interface TitleDetailsWritable extends Writable<TitleDetails> {
	loadingTrue: () => void;
	loadingFalse: () => void;
	setData: (json: TitleDetails) => void;
	reset: () => void;
}