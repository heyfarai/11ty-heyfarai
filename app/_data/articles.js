const { default: axios } = require("axios");
const slugify = require("../filters/slugify");
const url = process.env.BACKEND_URL;

module.exports = async () => {
  const body = {
    query: `
      query getArticles {
        articles {
          data {
            id
            attributes {
              title
              content
              publishedAt
            }
          }
        }
      }
      `,
  };
  try {
    const res = await axios.post(url, body);
    let data = res.data.data.articles.data;
    let articles = data.map((item) => {
      return {
        id: item.id,
        slug: slugify(item.attributes.title),
        title: item.attributes.title,
        content: item.attributes.content,
        publishedAt: item.attributes.publishedAt,
      };
    });
    return articles;
  } catch (error) {
    console.error(error);
  }
};
