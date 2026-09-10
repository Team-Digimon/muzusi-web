export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

export interface NewsListData {
  content: NewsItem[];
}

export type NewsKeyword = "전체" | "코스닥" | "코스피";
