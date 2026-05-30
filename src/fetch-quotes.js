async function fetchQuotes(){
    const returnState = await fetch('https://api.animechan.io/v1/quotes/random').then((response) => response.json());
    returnState.tweetURL = `https://www.twitter.com/intent/tweet?text=${encodeURIComponent(`"${returnState.quote}" -${returnState.character} from ${returnState.anime}.`)}%0ARandom%20Anime%20Quote%20Generator%20made%20by%20%40AyosaFacundo.%0Ahttps%3A%2F%2Fgithub.com%2FFacundo-Ayosa%2FRandomQuoteMachine`;
    return returnState;
}
export default fetchQuotes;