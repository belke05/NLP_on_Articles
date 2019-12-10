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

module.exports.delay = delay;
module.exports.convertToCSV = convertToCSV;
module.exports.cleanArticles = cleanArticles;
