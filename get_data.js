var fs = require("fs");
const axios = require("axios").default;

const keys = require("./key.js");
const {
  delay,
  convertToCSV,
  cleanArticles
} = require("./helper/helper_functions");

const subject1 = "democrat";
const subject2 = "republican";
const subject3 = "trump";

const _url = (subject, page) =>
  `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${subject}&page=${page}&api-key=${keys.APIKEYNYTIMES}`;

const _url2 = subject =>
  `https://newsapi.org/v2/everything?q=${subject}&apiKey=${keys.APIKEYNEWSAPI}`;
const _url3 = subject =>
  `https://gnews.io/api/v3/search?q=${subject}&token=${keys.APIKEYGNEWSSAPI}`;

let articles = {};

feedArticles(subject1).then(x =>
  feedArticles(subject2).then(x =>
    feedArticles(subject3).then(x => {
      for (var key in articles) {
        fs.writeFile(`${key}.csv`, convertToCSV(articles[key]), function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    })
  )
);

async function feedArticles(subject) {
  let foundarticles;
  let res;
  try {
    res = await axios.get(_url(subject, 0));
    foundarticles = res.data.response.docs;
    await delay(10000);
    res = await axios.get(_url(subject, 1));
    foundarticles = foundarticles.concat(res.data.response.docs);
    await delay(10000);
    res = await axios.get(_url(subject, 2));
    foundarticles = foundarticles.concat(res.data.response.docs);
    await delay(10000);
    res = await axios.get(_url(subject, 3));
    foundarticles = foundarticles.concat(res.data.response.docs);
    await delay(10000);
    res = await axios.get(_url(subject, 4));
    foundarticles = foundarticles.concat(res.data.response.docs);
    await delay(10000);
    res = await axios.get(_url(subject, 5));
    foundarticles = foundarticles.concat(res.data.response.docs);
    articles[subject] = cleanArticles(foundarticles, subject);
  } catch (e) {
    console.error(e, "error");
  }
  return foundarticles;
}
