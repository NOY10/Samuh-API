const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const channel = [
  "220/Samuh-Originals",
  "218/Coming-Soon",
  "352/New-release",
  "237/Movies",
  "219/Series",
  "676/Short-films",
  "235/Kids",
  "226/Music-video",
];

async function fetchThumbnailData(channel) {
  try {
    const response = await axios.get(
      `https://samuhbhutan.com/carousel/${channel}`
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const thumbnails = $('div[class="filter-category"]')
      .find("ul > li > a > div > img", html)
      .map(function () {
        const img = $(this).attr("data-src");
        const title = $(this).attr("alt");
        return { title, img };
      })
      .get();

    return thumbnails;
  } catch (error) {
    console.error(`Error fetching data for ${channel}: ${error.message}`);
    return [];
  }
}

async function fetchAllThumbnailData() {
  const thumbnailPromises = channel.map(fetchThumbnailData);
  return Promise.all(thumbnailPromises);
}

const slider_img_array = [];
const names = [];
const themes = [];
const releases = [];
const descriptions = [];
const tags = [];
const imgs = [];
const times = [];

async function slider_img() {
  const response = await axios.get("https://samuhbhutan.com/");
  const html = response.data;
  const $ = cheerio.load(html);

  $('div[class="item"]')
    .find("div > img", html)
    .each(function () {
      const img = $(this).attr("data-src");
      imgs.push(img);
    });
  $('div[class="slider-content"]')
    .find("div > h3", html)
    .each(function () {
      const name = $(this).text().trim();
      names.push(name);
    });
  $('div[class="slider-content"]')
    .find("ul > li", html)
    .each(function () {
      const theme = $(this).text().trim();
      themes.push(theme);
    });
  $('div[class="category-release"]')
    .find("p", html)
    .each(function () {
      const release = $(this).text().trim();
      releases.push(release);
    });
  $('div[class="show-descpription"]')
    .find("div > p", html)
    .each(function () {
      const description = $(this).text().trim();
      descriptions.push(description);
    });
  $('div[class="category-release"]').each(function () {
    const time = $(this).children("span").text();
    times.push(time);
  });
  $('div[class="show-descpription"]')
    .find("div > span", html)
    .each(function () {
      const tag = $(this).text().trim();
      tags.push(tag);
    });

  for (x in names) {
    const Fimg = imgs[x];
    const Fname = names[x];
    const Ftheme = themes[x];
    const Frelease = releases[x];
    const Ftime = times[x];
    const Fdescription = descriptions[x];
    const Ftag = tags[x];

    slider_img_array.push({
      Fname,
      Fimg,
      Ftheme,
      Ftime,
      Frelease,
      Fdescription,
      Ftag,
    });
  }
  return slider_img_array;
}

async function slider_section() {
  const response = await axios.get("https://samuhbhutan.com/");
  const html = response.data;
  const $ = cheerio.load(html);

  const Sthumbnails = $('section[class="slider-section"]')
    .find("img", html)
    .map(function () {
      const img = $(this).attr("data-src");
      const title = $(this).attr("alt");
      return { title, img };
    })
    .get();

  return Sthumbnails;
}

async function setupServer() {
  const thumbnailData = await fetchAllThumbnailData();
  const sliderImg = await slider_img();
  const SsliderImg = await slider_section();

  app.get("/Samuh-Originals", (req, res) => {
    res.json(thumbnailData[0]);
  });

  app.get("/Coming-Soon", (req, res) => {
    res.json(thumbnailData[1]);
  });

  app.get("/New-release", (req, res) => {
    res.json(thumbnailData[2]);
  });

  app.get("/Movies", (req, res) => {
    res.json(thumbnailData[3]);
  });

  app.get("/Series", (req, res) => {
    res.json(thumbnailData[4]);
  });
  app.get("/Short-films", (req, res) => {
    res.json(thumbnailData[5]);
  });

  app.get("/Kids", (req, res) => {
    res.json(thumbnailData[6]);
  });

  app.get("/Music-Video", (req, res) => {
    res.json(thumbnailData[7]);
  });

  app.get("/slider_img", (req, res) => {
    res.json(sliderImg);
  });

  app.get("/slider-section", (req, res) => {
    res.json(SsliderImg);
  });

  app.get("/", (req, res) => {
    res.json("Samuh API");
  });

  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
}

setupServer().catch((error) => {
  console.error("Error setting up the server:", error);
});
