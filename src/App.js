import React, { useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import NewsCards from "./components/NewsCards/NewsCards";
import useStyles from "./styles";
import wordsToNumbers from "words-to-numbers";

const alanKey =
  "c5f1ccf350945de2516d9a6d682d0a742e956eca572e1d8b807a3e2338fdd0dc/stage";

function App() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadLines") {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "highlight") {
          setActiveArticle((prevState) => prevState + 1);
        } else if (command === "open") {
          const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > 20) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        <img
          src="https://alan.app/voice/images/previews/preview.jpg"
          className={classes.alanLogo}
          alt="logo"
        />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
}

export default App;
