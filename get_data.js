const axios = require("axios").default;
const keys = require("./key.js");
var fs = require("fs");
const limit = 3000;

const subject1 = "democrat";
const subject2 = "republican";
const subject3 = "trump";

let page_number1 = 0;
let page_number2 = 0;
let page_number3 = 0;

const _url = (subject, page) =>
  `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${subject}&page=${page}&api-key=${keys}`;

let articles = {};

feedArticles(subject1).then(x =>
  feedArticles(subject2).then(x =>
    feedArticles(subject3).then(x => {
      fs.writeFile(`test.txt`, JSON.stringify(articles), function(err) {
        if (err) {
          console.log(err);
        }
      });
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
// feedArticles(url2, subject2);
// feedArticles(url3, subject3);

async function feedArticles(subject) {
  let foundarticles;
  let res;
  res = await axios.get(_url(subject, 0));
  foundarticles = res.data.response.docs;
  res = await axios.get(_url(subject, 1));
  foundarticles = foundarticles.concat(re.data.response.docs);
  res = await axios.get(_url(subject, 2));
  foundarticles = foundarticles.concat(res.data.response.docs);
  res = await axios.get(_url(subject, 3));
  foundarticles = foundarticles.concat(res.data.response.docs);
  res = await axios.get(_url(subject, 4));
  foundarticles = foundarticles.concat(res.data.response.docs);
  res = await axios.get(_url(subject, 5));
  foundarticles = foundarticles.concat(res.data.response.docs);
  articles[subject] = cleanArticles(foundarticles, subject);
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
