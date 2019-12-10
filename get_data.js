const axios = require("axios").default;
const keys = require("./key.js");
var fs = require("fs");

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

function cleanArticles(articles, subject) {
  return articles.map(article => {
    return {
      abstract: article.abstract,
      lead_paragraph: article.lead_paragraph,
      news_desk: article.lead_paragraph,
      section_name: article.section_name,
      subsection_name: article.subsection_name,
      time: article.pub_date,
      subject: subject
    };
  });
}

function convertToCSV(json) {
  var fields = Object.keys(json[0]);
  var replacer = function(key, value) {
    return value === null ? "" : value;
  };
  var csv = json.map(row => {
    return fields
      .map(fieldName => JSON.stringify(row[fieldName], replacer))
      .join(",");
  });
  csv.unshift(fields.join(",")); // add header column
  console.log(csv.join("\r\n"));
  const csvformat = csv.join("\r\n");
  return csvformat;
}

async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise(resolve => setTimeout(resolve, ms));
}
