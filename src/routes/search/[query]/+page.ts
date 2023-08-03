import type { PageLoad } from './$types';
import type { SearchResults } from '$lib/interfaces/SearchResults';
import type { OmdbError } from '$lib/interfaces/Error';
import { searchResults } from '$lib/stores';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, params }) => {
    try {
        let searchResults: SearchResults = await searchTitle(fetch, params.query);
        return {
            searchResults,
        };
    } catch (error: unknown) {
        console.log(error);
        throw error;
    }
}) satisfies PageLoad;

async function searchTitle(
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    query: string
): Promise<SearchResults> {
    try {
        if (!query) throw error(400, 'No query');
        let res: Response = await fetch(`/api/search?query=${query}`);
        let json: SearchResults | OmdbError = await res.json();
        if (json.Response === 'False') throw error(400, (json as OmdbError).Error);
        searchResults.setData(json as SearchResults);
        return json as SearchResults;
    } catch (error: any) {
        throw error;
    }
}
