const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
    const result = sentiment.analyze(text);
    return result;
};

// Example usage
const text = "I am very happy with the way my interview went!";
const sentimentResult = analyzeSentiment(text);
console.log(sentimentResult);
