import { useEffect, useState, useCallback } from 'react';
import fetchquote from './fetch-quotes';
import quotes from './img/doubleQuotes.svg';
import './App.css';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetcher = useCallback(async () => {
    setIsLoading(true);
    let validQuote = null;
    let retries = 0;
    const maxRetries = 5;

    try {
      while (!validQuote && retries < maxRetries) {
        const res = await fetchquote();
        if (res.message === 'Too many requests! Rate limit will reset in 1 hour.') {
          retries++;
          const backoffTime = 1 * 60 * 61 * 1000; 
          console.warn(`429 Too Many Requests. Retrying in 1 hour...`);
          await delay(backoffTime);
          continue; 
        }
      }
      if (validQuote) {
        setQuote(validQuote);
      } else {
        console.error("Max retries reached. Could not fetch a valid quote.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clickHandler = () => {
    if (isLoading || isAnimating) return;

    setIsAnimating(true);
    fetcher();

    setTimeout(() => {
      setIsAnimating(false);
    }, 900);
  };

  useEffect(() => {
    fetcher();
  }, [fetcher]);
  return (
    <div className="card" id="quotebox">
      <img src={quotes} id="cardimg" alt="Quote Icon" />
      
      <div className={isAnimating ? "inactive" : "active"}>
        <h2 className="quote" id="text">
          {quote ? quote.data.content : (isLoading ? "Loading..." : "")}
        </h2>
        {quote && (
          <>
            <h3 className="character" id="author"> - {quote.data.character.name}</h3>
            <h3 className="anime">{quote.data.anime.name}</h3>
          </>
        )}
      </div>
      
      <div className="links">
        {quote?.tweetURL && (
          <a id="tweet-quote" href={quote.tweetURL} target="_blank" rel="noreferrer">
            Tweet it!
          </a>
        )}
        <button 
          id="new-quote" 
          className="btn" 
          onClick={clickHandler}
          disabled={isLoading || isAnimating} 
        >
          {isLoading ? "Loading..." : "Get Another Quote"}
        </button>
      </div>
    </div>
  );
}

export default App;
