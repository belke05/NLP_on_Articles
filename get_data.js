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
const url1 = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${subject1}&limit=${limit}&api-key=${keys}`;
const url2 = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${subject2}&limit=${limit}&api-key=${keys}`;
const url3 = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${subject3}&limit=${limit}&api-key=${keys}`;

let articles = {};

feedArticles(url1, subject1).then(x =>
  feedArticles(url2, subject2).then(x =>
    feedArticles(url3, subject3).then(x => {
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

async function feedArticles(url, subject) {
  let foundarticles;
  const res = await axios.get(_url(subject, 0));
  foundarticles = res.data.response.docs;
  // console.log(foundarticles, "))))) 1");
  const res2 = await axios.get(_url(subject, 1));
  foundarticles = foundarticles.concat(res2.data.response.docs);
  console.log(foundarticles, "------ 2");
  const res3 = await axios.get(_url(subject, 2));
  foundarticles = foundarticles.concat(res3.data.response.docs);
  articles[subject] = cleanArticles(foundarticles, subject);
  console.log(articles, "---1");
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
  console.log(fields, "fields -------"), json, "json -------";
  var csv = json.map(row => {
    console.log("row", row);
    return fields
      .map(fieldName => {
        return JSON.stringify(row[fieldName], replacer);
      })
      .join(",");
  });
  console.log(csv, "csv -------");
  csv.unshift(fields.join(",")); // add header column
  console.log(csv.join("\r\n"));
  const csvformat = csv.join("\r\n");
  return csvformat;
}

// function createIntervalsGetArticles(page_number, array, url, time) {
//   const intervalId = setInterval(() => {
//     page_number === 10 ? clearInterval(intervalId) : null;
//     axios
//       .get(url)
//       .then(res => {
//         let articles = res.data.response.docs;
//         array.push(articles);
//         page_number++;
//         if (page_number == 2) console.log(array);
//       })
//       .catch(err => console.log(err));
//   }, time);
// }

// function formatResultNyTimes(article) {
//   let article_array = [];
//   let non_empty_articles;
//   let article_obj = data.response.docs;
//   article_obj.forEach(art => {
//     let new_art = {};
//     // make sure we only get sports articles
//     if (art.section_name == "Sports") {
//       let imagelink = "";
//       if (art.multimedia !== [] && art.multimedia[0] !== undefined) {
//         imagelink = "https://static01.nyt.com/" + art.multimedia[0].url;
//       }
//       new_art.imgUrl = imagelink.trim();
//       new_art.title = art.headline.main;
//       new_art.description = art.abstract;
//       new_art.link = art.web_url;
//       new_art.league = sport;
//       var d = new Date(`${art.pub_date}`);
//       new_art.pub_date = d;
//     }
//     if (new_art.length !== 0) {
//       article_array.push(new_art);
//     }
//   });
//   non_empty_articles = article_array.filter(
//     value => JSON.stringify(value) !== "{}"
//   );
//   // console.log(non_empty_articles);
//   return non_empty_articles;
// }
