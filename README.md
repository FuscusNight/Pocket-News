# 📰 Pocket News

A mobile news app for discovering, searching, and reading news articles from around the world whilst providing a means to translate them to different languages, powered by the **NewsAPI.org** and **MistralAI API**.  
_This project is developed as part of an app development course at the Åland University Of Applied Sciences in a period of about 2 to 3 weeks._

---

# NOTE :

You need a .env file in root of the project and in it you need both a NewsAPI Key saved in it and a MistralAI API Key, both are free to grab.

- **NewsAPI Key** : https://newsapi.org/
- **MistralAPI** : https://mistral.ai/

![image](https://github.com/user-attachments/assets/08b1b9ba-ca87-4f7a-9efb-c30357840695)

Because of the limitation of free API keys , rate limit errors can occur, especially with Mistral.
These Rate limit are slightly missleading when it comes to MistralAI API , my own testing showed that neither request or token limits are hit when sometimes a 429 error limit happens
Instead what is happening , the free tier key will sometimes get thorttled by the API system to give more head room for premium paid key requests , so if you get an error
just keep re-trying, it's a ficle API, sometimes you can translate 10 things without issues, other times even using it for the first time in a day it hits you with a rate error and you gotta retry a few times or a wait a bit.

### Apart from that , the rest is the usual :

- NPM install to get all depedencies needed for the project auto installed
- Have Expog go set up on your VSC and Phone to scan the QR so you can run it on your phone for testing (or set up a virutal machine phone if you'd like)

## 📋 Original Project Overview

**Pocket News** allows folks to:

- 🔍 **Search** for news articles by keywords.
- 🌍 **Filter** news by country and sort by latest or other available options from the free tier API.
- 📰 **Read** article titles and summaries.
- 🌐 **Open** full articles in their browser (due to API limitations).
- 🎨 Enjoy a (hopefully) clean, user-friendly interface.

---

## ✅ Must Haves

- **Search & Filter:**  
  Search for news articles using keywords. Filter results by country and sort by latest or other available options provided by the API.
- **Article Previews:**  
  Display article titles and summaries/snippets.
- **Open Full Article:**  
  Clicking/tapping an article opens the full article in the user’s browser.
- **Decent UI:**  
  The app will have a clean and easy-to-navigate user interface.
- **Centralized API system:**
  Make sure APi is centralized and not hardcoded to screens

---

## ✨ Should Haves

- **2D World Map:**  
  🗺️ Interactive or just asthetic 2D map where users see the whole world displayed.
- **AI Or Other Means Of Translation:**  
  🤖 Integrate Mistral AI to translate article titles and snippets. Users can select a language, and the AI will translate the selected article’s info that the news API gives it.
  If problems occur with the AI API, look into alternative means to do/request translations of non-english articles
- **Caching:**
  Cache data, so if a user goes back to a previous screen or sees the same article, it doesn't need to request that again from the API

---

## 💡 Nice to Have

- **3D Globe:**  
  🌐 Replace the 2D map with a 3D interactive globe for a more engaging experience.

---

## 🛠️ Tech Stack

- **NewsAPI.org** (Free Tier)
- **Mistral AI** – For translating (Free Tier)
- **React Native**
- **Expo Go**

---

### Future ?

Potentially after this course is done i might refine this more or even do some more note worthy changes but no gurantees , there is some repeating code i should move to its own file and import to the screens and styling is maybe a bit messy and repeated in places that could be adjusted.
