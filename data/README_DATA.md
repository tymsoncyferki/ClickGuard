## Source datasets

- clickbait_data.csv
columns: headline, clickbait
purpose: source dataset, https://www.kaggle.com/datasets/amananandrai/clickbait-dataset (set 1 in merged datasets)

- train2.csv
columns: label, title
purpose: source dataset, https://www.kaggle.com/datasets/vikassingh1996/news-clickbait-dataset?select=train2.csv (set 2 in merged datasets)

- clickbait17-train-170331, clickbait17-validation-170630, clickbait17-test-170720
files: instances.jsonl (posts with article title and paragraphs), truth.jsonl (annotator judgments and truthClass)
purpose: source dataset, Webis Clickbait Corpus 2017 (Clickbait Challenge), https://webis.de/data/webis-clickbait-17.html (set 3 in merged datasets)

- spoiling-clickbait-22
files: train.jsonl, validation.jsonl
purpose: source dataset for spoiling, Webis Clickbait Spoiling Corpus 2022, https://webis.de/data/webis-clickbait-22.html

## Clickbait detection

- merged_all_datasets.csv
columns: title, clickbait, set, char_capital, char_small, char_special, blank, numerical, letters, outlier
purpose: all titles from the three source datasets merged into one file (88805 titles, not balanced). `set` is the source (1 - Kaggle 1, 2 - Kaggle 2, 3 - Clickbait Challenge), other columns are character counts and outlier flag from 1-Getting-Data.ipynb

- merged_datasetes_balanced.csv
columns: same as merged_all_datasets.csv
purpose: balanced sample with 20000 titles (10000 clickbait, 10000 non-clickbait), used in the first experiments (6-Word-Embedding-Models.ipynb, 6.1-Comparison_SOTA.ipynb)

- merged_datasetes_balanced_huge.csv
columns: same as merged_all_datasets.csv
purpose: balanced sample with 40000 titles (20000 / 20000). Main dataset for training and evaluation of the detection models (Table 1 in the paper)

- merged_datasetes_balanced_huge_cleaned.csv
columns: same as merged_all_datasets.csv
purpose: cleaned version of merged_datasetes_balanced_huge.csv, created in 2.1-Creating_dataset_title_detection_balanced_cleaned.ipynb and used for TF-IDF models

- cc_dataset_balanced.csv
columns: title, body, clickbait
purpose: balanced titles with article bodies from Clickbait Challenge, used for informativeness measures

- openai_batch_input.jsonl, gemini_batch_input.jsonl
purpose: batch requests for classifying titles with gpt-4o-mini and Gemini, used in 6.1-Comparison_SOTA.ipynb

- input_batches_paper
files: openai_batch_input.jsonl, gemini_batch_input.jsonl
purpose: batch requests (same task as above) in the version used for the paper

- output_batches_openai, output_batches_gemini
purpose: responses for the batch requests above, so the comparison can be checked without calling the APIs again

## Informativeness measures

- inf_measures_data/data.csv, inf_measures_data/test_data.csv
columns: title, body, clickbait
purpose: train and test data for 3-Informativeness-Measures.ipynb

- inf_measures_data/bait_words.csv, inf_measures_data/ngrams.csv
columns: feature, total_0, mean_0, total_1, mean_1, ratio
purpose: words and n-grams with their counts in non-clickbait (0) and clickbait (1) titles. bait_words.csv is used by the baitness measure (measure.py)

## Spoiling

- spoiling_data.csv (separator `;`)
columns: targetTitle, targetParagraphs, humanSpoiler, spoiler, tags, spoilerPositions
purpose: data for spoiler generation prepared from spoiling-clickbait-22

- train_spoiler_bm25.csv (separator `;`)
columns: targetTitle, targetParagraphs, tags, spoilerPositions, important_sentences, spoiler_bm25
purpose: most important sentences selected with BM25, used for fine-tuning BERT in 8.5-LLM-Spoiling.ipynb

- spoiling_metrics_df_1.csv (separator `;`)
columns: original and generated spoilers with their metrics (cosine similarity, METEOR, BLEU, BERTScore)
purpose: results of spoiler evaluation from 9-OPENAI-Spoiling.ipynb
