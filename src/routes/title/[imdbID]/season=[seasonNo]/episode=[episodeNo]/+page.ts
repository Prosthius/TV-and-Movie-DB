import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { selectedTitleDetails, navigatedTo } from '$lib/stores';
import type { TitleDetails } from '$lib/interfaces/TitleDetails';
import type { OmdbError } from '$lib/interfaces/Error';

export const load = (async ({ fetch, params }) => {
    selectedTitleDetails.set(await (getInfo(fetch, params.imdbID, params.seasonNo, params.episodeNo)));
    const titleDetails: TitleDetails = get(selectedTitleDetails);
    navigatedTo.set(true);

    throw redirect(303, `/title/${titleDetails.imdbID}`);
}) satisfies PageLoad;

async function getInfo(
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
    imdbID: string,
    season?: string,
    episode?: string
): Promise<TitleDetails> {
    try {
        let res: Response = await fetch(`/api/title?imdbID=${imdbID}&season=${season}&episode=${episode}&plot=full`);
        let json: TitleDetails | OmdbError = await res.json();
        if (json.Response === 'False') throw new Error((json as OmdbError).Error);
        selectedTitleDetails.setData(json as TitleDetails);
        return json as TitleDetails;
    } catch (error: unknown) {
        console.log(error);
        throw error;
    }
}
