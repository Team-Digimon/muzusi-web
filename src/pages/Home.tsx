import getNews from "@/api/news/getNews";
import getNewsByKeyword from "@/api/news/getNewsByKeyword";
import getStocksRank from "@/api/stocks/getStocksRank";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import News from "@/components/home/News";
import Rank from "@/components/home/Rank";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import type { NewsItem } from "@/types/news";
import type { RankType, StockRankItem } from "@/types/stock";

// 컴포넌트 안에 두면 렌더마다 새 배열이 만들어져서, News/Rank를
// React.memo로 감싸도 메모이제이션이 무력화된다. 고정 데이터라 바깥으로 뺐다.
const keywords = ["전체", "코스닥", "코스피"];
const types: { value: RankType; korean: string }[] = [
  { value: "VOLUME", korean: "거래량" },
  { value: "RISING", korean: "급상승" },
  { value: "FALLING", korean: "급하락" },
];

const Home = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsPage, setNewsPage] = useState(0);
  const [keyword, setKeyword] = useState("전체");

  const [rank, setRank] = useState<StockRankItem[]>([]);
  const [type, setType] = useState<RankType>("VOLUME");
  const [time, setTime] = useState("");
  const [rankPage, setRankPage] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [isNewsLoading, setIsNewsLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    setIsNewsLoading(true);
    try {
      const response = await getNews({
        page: 0,
        size: 50,
        sort: "pubDate,desc",
      });
      setNewsPage(0);
      setNews(response.data.content);
    } catch (error) {
      console.error(
        "주요 뉴스 가져오기 실패: ",
        error instanceof globalThis.Error ? error.message : error
      );
      setError(error);
    } finally {
      setIsNewsLoading(false);
    }
  }, []);

  const fetchNewsByKeyword = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getNewsByKeyword({
        page: 0,
        size: 50,
        sort: "pubDate,desc",
        keyword: keyword,
      });
      setNewsPage(0);
      setNews(response.data.content);
    } catch (error) {
      console.error(
        "키워드 뉴스 가져오기 실패: ",
        error instanceof globalThis.Error ? error.message : error
      );
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  const fetchRank = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getStocksRank({
        type: type,
      });
      setRank(response.data.rank);
      setTime(response.data.time);
    } catch (error) {
      console.error(
        "주식 순위 가져오기 실패: ",
        error instanceof globalThis.Error ? error.message : error
      );
      setError(error);
    }
    setIsLoading(false);
  }, [type]);

  useEffect(() => {
    if (keyword === "전체") {
      fetchNews();
    } else {
      fetchNewsByKeyword();
    }
    fetchRank();
  }, [fetchNews, fetchNewsByKeyword, keyword, fetchRank]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <Container>
      <News
        news={news}
        newsPage={newsPage}
        keyword={keyword}
        keywords={keywords}
        setNewsPage={setNewsPage}
        setKeyword={setKeyword}
        isNewsLoading={isNewsLoading}
      />
      <Rank
        rank={rank}
        rankPage={rankPage}
        type={type}
        types={types}
        time={time}
        setRankPage={setRankPage}
        setType={setType}
      />
    </Container>
  );
};

export default Home;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 56px;
`;
