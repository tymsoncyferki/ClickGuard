# ClickGuard

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23765302.svg)](https://doi.org/10.5281/zenodo.23765302)

Detecting articles with clickbait headlines.

ClickGuard is a Chrome extension that detects clickbait titles before and after opening an article, shows clickbait probability with a short explanation and generates spoilers for clickbait articles.

Demo video: https://www.youtube.com/watch?v=ZoVK4trbrc4

Archived version of this repository (Zenodo): https://doi.org/10.5281/zenodo.23765302

- [Repository contents](#repository-contents)
- [Requirements](#requirements)
- [1. Installation manual](#1-installation-manual)
- [2. User manual](#2-user-manual)
  - [2.1. Overview](#21-overview)
  - [2.2. Post-click detection](#22-post-click-detection)
  - [2.3. Pre-click detection](#23-pre-click-detection)
- [3. Running the API locally](#3-running-the-api-locally)
- [4. Reproducing the results](#4-reproducing-the-results)
  - [4.1. Clickbait detection (Table 1)](#41-clickbait-detection-table-1)
  - [4.2. Other experiments](#42-other-experiments)
- [5. Tests and timings](#5-tests-and-timings)
- [6. Data](#6-data)
- [License](#license)

## Repository contents

- `extension/` - source code of the Chrome extension (Manifest V3). This folder is loaded into the browser.
- `api/` - backend service written in Flask. It extracts article content, runs the clickbait model and generates spoilers and explanations with OpenAI API. Contains the deployed model (`api/models/`), NLTK data and tests.
- `notebooks/` - Jupyter notebooks with data preparation, EDA, informativeness measures and all detection and spoiling experiments.
- `final_models/` - trained models produced by the notebooks (Random Forest and XGBoost on OpenAI embeddings and informativeness measures). The XGBoost model is the one deployed in the API.
- `data/` - datasets used for training and evaluation, together with OpenAI and Gemini batch inputs and outputs. Short description of the files is in `data/README_DATA.md`.
- `environments/` - conda environments and pip requirements used to run the notebooks.
- `docs/images/` - screenshots used in this README.

## Requirements

- Chrome or other Chromium-based browser.
- Python 3.11 or newer (we used 3.12) if you want to run the API or the notebooks.
- OpenAI API key if you want to run the API locally or rerun the experiments that use OpenAI (embeddings `text-embedding-3-large`, spoilers and explanations `gpt-4o-mini`).
- No GPU is needed for the extension and the API. Fine-tuning RoBERTa in `notebooks/8-BERT-Detection.ipynb` is much faster with a GPU.

## 1. Installation manual

The API is deployed online at https://clickguard-api-82wk.onrender.com and the extension uses it by default, so you can install the extension and start using it right away, without running the API yourself. The server runs on a free tier, so the first request after a longer break can take a while (sometimes over a minute). If you want to run the API on your own machine, see [3. Running the API locally](#3-running-the-api-locally).

To start using our app, one should follow the steps below.

- Download the `extension` folder from this repository. If it was downloaded as a zip, unpack it.
- Open a Chromium-based browser (e.g. Google Chrome), click on the extensions icon <img src="docs/images/exticon.png" alt="extensions icon" height="16"> and go to *manage extensions* page. Alternatively, type `chrome://extensions` in the address bar.
- Turn on developer mode using a switch in the upper right corner.

  <img src="docs/images/devmode.png" alt="Developer mode switch">

- Click *load unpacked* button in the top left corner. In the popup select previously downloaded folder with the extension files.
- A new tile presenting the extension should appear.

  <img src="docs/images/exttile.png" alt="ClickGuard extension tile">

- In order to use all functionalities, pin the extension to the bar by clicking the pin icon.

  <img src="docs/images/extpinned.png" alt="Pinning the extension">

## 2. User manual

### 2.1. Overview

The extension has two main modes: post-click detection, for running detection after entering an article page, and pre-click detection, for detecting clickbaits beforehand. The main UI element is a popup, where you can trigger actions manually or set them to trigger automatically.

#### 2.1.1. Popup

In order to start using the extension, click on the yellow extension icon.

<img src="docs/images/iconbar.png" alt="Extension bar">

After that, the popup will appear. In the popup, the user can do several things.

- Access options page by clicking on the gear icon.
- Perform manual check by clicking yellow *Check* button.
- View prediction results.

The default popup design can be seen in Figure 2.1. Figure 2.2 shows the prediction output, which consists of clickbait probability, explanation and optionally spoiler.

<table>
  <tr>
    <td align="center"><img src="docs/images/extension-popup.png" alt="Popup before detection" width="300"></td>
    <td align="center"><img src="docs/images/popup_after_detection.png" alt="Popup after detection" width="300"></td>
  </tr>
  <tr>
    <td align="center"><em>Figure 2.1: Before detection</em></td>
    <td align="center"><em>Figure 2.2: After detection</em></td>
  </tr>
</table>

#### 2.1.2. Options page

In the options page, the user can configure the behaviour of the app. Settings are saved in the browser sync storage. More detailed description of available options is presented in the next sections.

#### 2.1.3. Badges and Icons

The extension icon is used not only to trigger the popup, but also to display badges. Badges are shown in the extension bar on processed article pages in post-click detection. If the probability of title being a clickbait is below 0.4, the green icon is shown. If the probability is between 0.4 and 0.6, a yellow warning sign is displayed. For titles with a clickbait probability exceeding 0.6, a red exclamation mark badge is shown to alert a user.

<table>
  <tr>
    <td align="center"><img src="docs/images/icon_default.png" alt="Default extension icon" width="110"></td>
    <td align="center"><img src="docs/images/icon_green.png" alt="Icon with badge for non-clickbait" width="110"></td>
    <td align="center"><img src="docs/images/icon_yellow.png" alt="Icon with badge for potential clickbait" width="110"></td>
    <td align="center"><img src="docs/images/icon_red.png" alt="Icon with badge for clickbaits" width="110"></td>
  </tr>
  <tr>
    <td align="center"><em>(a) Default extension icon</em></td>
    <td align="center"><em>(b) Icon with badge for non-clickbait</em></td>
    <td align="center"><em>(c) Icon with badge for potential clickbait</em></td>
    <td align="center"><em>(d) Icon with badge for clickbaits</em></td>
  </tr>
</table>

<p align="center"><em>Figure 2.3: Badges</em></p>

In the pre-click detection, icons are placed to the right of the link titles. As previously, the red one is used for clickbait titles, yellow for potential clickbait, and green for titles with low probability of being clickbait. Examples are shown in Figure 2.4 and in Figure 2.5.

<p align="center">
  <img src="docs/images/preclickdesign1.png" alt="Pre-click warning design" width="640"><br>
  <em>Figure 2.4: Pre-click warning design</em>
</p>

<p align="center">
  <img src="docs/images/preicons2.png" alt="Pre-click warning design" width="640"><br>
  <em>Figure 2.5: Pre-click warning design</em>
</p>

### 2.2. Post-click detection

The first mode is post-click detection. It scans the content and runs detection after the user enters a desired article page.

#### 2.2.1. Configuration

There are 4 different configurations for this mode.

- **Manual-only**, where the user manually triggers detection by clicking the "check" button in the popup.
- **Monitored Detection**, where the extension automatically checks for clickbaits on sites specified by the user.
- **Semi-automatic**, where the extension automatically checks for clickbaits on sites specified by the user and on pages containing relevant meta tag (`<meta property="og:type" content="article" />`).
- **Automatic**, where the extension checks for clickbaits on every page.

Preferred detection option can be chosen in the options page. To save the choice, click on the 'save' button.

<p align="center">
  <img src="docs/images/options_postclick.png" alt="Post-click settings panel" width="480"><br>
  <em>Figure 2.6: Post-click settings panel</em>
</p>

#### 2.2.2. Adding sites to the monitored sites list

Sites can be added to the list (as well as deleted) in the options page. Use asterisk to match any characters. Asterisk is added at the beginning, if the provided pattern does not start with *http*.

**HINT:**
When adding a url, try to represent the article url patterns. For example, `*thesun.co.uk/*` is too loose and will match also home pages. Pattern `*thesun.co.uk/*/*/*/` properly matches url schema `https://www.thesun.co.uk/<section>/<id>/<title>/`.

<p align="center">
  <img src="docs/images/options_sites.png" alt="Monitored sites panel" width="480"><br>
  <em>Figure 2.7: Monitored sites panel</em>
</p>

#### 2.2.3. Detection pipeline

After detection is made:

- A badge is displayed on the extension icon.
- Prediction results are displayed in the popup.
- Popup pops up automatically, if the prediction is a clickbait.

Spoilers are generated only for articles with titles classified as clickbaits. However, user can use the toggle switch to turn on and off spoiler generation.

<p align="center">
  <img src="docs/images/spoilergenerationpoption.png" alt="Spoiler generation toggle" width="480"><br>
  <em>Figure 2.8: Spoiler generation toggle</em>
</p>

### 2.3. Pre-click detection

In the pre-click mode, detection is run before a user accesses an article.

#### 2.3.1. Configurations

There are two configurations available. One for Google Search, and one for The Sun news portal. They can be turned on using toggle switches in the options panel.

<p align="center">
  <img src="docs/images/options_preclick.png" alt="Pre-click settings panel" width="480"><br>
  <em>Figure 2.9: Pre-click settings panel</em>
</p>

## 3. Running the API locally

You don't need this step to use the extension, because the API is already deployed online (see [1. Installation manual](#1-installation-manual)). Run it locally if the online version is not available or if you want to test changes in the backend.

All commands below are run from the root of the repository.

- Create and activate a virtual environment.

  ```
  python3 -m venv .venv
  source .venv/bin/activate
  ```

  On Windows use `.venv\Scripts\activate` instead of the second command.

- Install the requirements.

  ```
  cd api
  pip install -r requirements.txt
  ```

- Create `.env` file in the `api` folder. You can copy `.env.example` and fill in your OpenAI API key.

  ```
  cp .env.example .env
  ```

- Start the service. It has to be started from the `api` folder, because the model and NLTK data are loaded from paths relative to it.

  ```
  python main.py
  ```

- The service will be running on http://localhost:8080. Opening it in the browser should show a simple page that confirms the API works.

Required variables in `.env`:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | yes | OpenAI API key, used for title embeddings, explanations and spoilers. |

### Connecting the extension to the local API

By default the extension sends requests to the online API. The address is saved in the extension storage when the extension is installed, so to switch to the local API:

- Go to `chrome://extensions` and click *service worker* link on the ClickGuard tile. DevTools window will open.
- In the *Console* tab run:

  ```
  chrome.storage.sync.set({proxyUrl: "http://127.0.0.1:8080"})
  ```

- To go back to the online API, run the same command with `https://clickguard-api-82wk.onrender.com`.

Another option is to change `DEFAULT_PROXY_URL` in `extension/background.js` before loading the extension for the first time.

## 4. Reproducing the results

The notebooks are meant to be run from the `notebooks` folder, because they read data with relative paths like `../data/...`. Environments:

- `environments/main_env.yaml` (conda) or `environments/main_requirements.txt` (pip) for most of the notebooks,
- `environments/eda_env.yaml` for `2-EDA.ipynb` and `8.5-LLM-Spoiling.ipynb`,
- `environments/infm_requirements.txt` for `3-Informativeness-Measures.ipynb`.

Example for conda:

```
conda env create -f environments/main_env.yaml
conda activate main_env
cd notebooks
jupyter notebook
```

All notebooks are saved with their outputs, so the results can be checked without running them again.

### 4.1. Clickbait detection (Table 1)

| Method | F1-score | Notebook |
|---|---|---|
| TF-IDF + Random Forest | 0.829 | `5-TFIDF_Traditional_ML_Models.ipynb` |
| RoBERTa (fine-tuned) | 0.842 | `8-BERT-Detection.ipynb` |
| OpenAI Embeddings + XGBoost | 0.864 | `7-LLM-OPENAI.ipynb` |
| Hybrid XGBoost (deployed) | 0.909 | `7.5-LLM-OPENAI-Baitness-Measure.ipynb` |

Notes:

- All models are trained and evaluated on `data/merged_datasetes_balanced_huge.csv` (TF-IDF models also on its cleaned version `data/merged_datasetes_balanced_huge_cleaned.csv`).
- `7-LLM-OPENAI.ipynb` gets title embeddings from OpenAI using batch mode. It needs `OPENAI_API_KEY` and saves request and result files to `request_files_openai/` in the root of the repository (create this folder before running). Batch requests can take up to 24 hours to finish.
- `7.5-LLM-OPENAI-Baitness-Measure.ipynb` reads the embeddings created in the previous notebook, adds informativeness measures and trains the final models. The trained models are saved to `final_models/`. The XGBoost model from this folder is the one used in `api/models/`.
- The embedding files we used in the paper (`request_files_openai/`) are not available, so to rerun notebooks 7 and 7.5 the embeddings have to be generated again with notebook 7. It costs less than 1 USD for the whole dataset. OpenAI embeddings are not fully deterministic, so the scores can be slightly different from the ones in the table. The notebooks are saved with their outputs and the trained models are in `final_models/`, so the reported results can also be checked without running anything.
- Fine-tuning RoBERTa without a GPU takes a lot of time.

### 4.2. Other experiments

- `1-Getting-Data.ipynb` - getting data from multiple sources and transforming it to a common structure.
- `2-EDA.ipynb`, `2.1-Creating_dataset_title_detection_balanced_cleaned.ipynb` - exploratory data analysis and creating the balanced dataset.
- `2.5-Dummy-Classifier.ipynb` - baseline.
- `3-Informativeness-Measures.ipynb` - informativeness measures and their analysis.
- `4-TFIDF-Trivial.ipynb` - simple TF-IDF models on raw and cleaned data.
- `6-Word-Embedding-Models.ipynb` - models based on pre-trained Word2Vec and GloVe embeddings.
- `6.1-Comparison_SOTA.ipynb` - comparison with LLMs (Gemini).
- `8.5-LLM-Spoiling.ipynb` - fine-tuning BERT for spoiling.
- `9-OPENAI-Spoiling.ipynb` - spoiler generation with OpenAI models.

## 5. Tests and timings

To run unit tests, in the `api` folder run:

```
PYTHONPATH=. python -m unittest discover -s tests -p "test_*.py"
```

Some tests call OpenAI API, so `.env` with `OPENAI_API_KEY` is needed.

To measure processing time of the backend on saved pages from `api/test_files`, in the `api` folder run:

```
pip install tqdm
PYTHONPATH=. python tests/performance.py
```

The script runs post-click detection 20 times and saves the statistics (average, standard deviation, median, min and max) to `timings.txt`. Times depend on the machine and on OpenAI API response times, so they will differ from the ones in the paper.

## 6. Data

Datasets are in the `data` folder, files are UTF-8 encoded CSV and JSONL. Description of the main files is in `data/README_DATA.md`. Sources:

- Webis Clickbait Corpus 2017: https://webis.de/data/webis-clickbait-17.html (`clickbait17-*` folders)
- Webis Clickbait Spoiling Corpus 2022: https://webis.de/data/webis-clickbait-22.html (`spoiling-clickbait-22`)
- Clickbait dataset from Kaggle: https://www.kaggle.com/datasets/amananandrai/clickbait-dataset (`clickbait_data.csv`)
- News clickbait dataset from Kaggle: https://www.kaggle.com/datasets/vikassingh1996/news-clickbait-dataset (`train2.csv`)

Other files were created by us from the datasets above (merged and balanced datasets, informativeness measures, OpenAI and Gemini batch files). The original datasets keep their own licenses, please check them on the linked pages.

## License

The code is released under the MIT License, see [LICENSE](LICENSE).
