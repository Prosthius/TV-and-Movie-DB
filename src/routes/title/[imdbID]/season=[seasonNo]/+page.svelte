<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { selectedTitleDetails, error } from '$lib/stores';
    import type { Season } from '$lib/interfaces/Season';
    import CircularProgress from '@smui/circular-progress';

    let baseURI: string = 'https://api.mtvdb.callumhopkins.au';

    onMount(async () => {
        getEpisodes($page.params.imdbID, parseInt($page.params.seasonNo)); 
    });

    async function getEpisodes(imdbID: string, season: number) {
        selectedTitleDetails.loadingTrue();
        error.errorFalse();
        try {
            let res: Response = await fetch(`${baseURI}/season?imdbID=${imdbID}&plot=full&season=${season}`);
            let json: Season = await res.json();
            console.log(json);
        } catch (errorStr: unknown) {
            console.log(errorStr);
        }
    }
</script>