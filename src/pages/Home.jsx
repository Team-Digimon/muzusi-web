import getNews from "@/api/news/getNews";
import getNewsByKeyword from "@/api/news/getNewsByKeyword";
import getStocksRank from "@/api/stocks/getStocksRank";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import News from "@/components/home/News";
import Rank from "@/components/home/Rank";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const Home = () => {
  const [news, setNews] = useState([]);
  const [newsPage, setNewsPage] = useState(0);
  const [keyword, setKeyword] = useState("전체");

  const [rank, setRank] = useState([]);
  const [type, setType] = useState("VOLUME");
  const [time, setTime] = useState("");
  const [rankPage, setRankPage] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const keywords = ["전체", "코스닥", "코스피"];
  const types = [
    { value: "VOLUME", korean: "거래량" },
    { value: "RISING", korean: "급상승" },
    { value: "FALLING", korean: "급하락" },
  ];

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getNews({
        page: 0,
        size: 50,
        sort: "pubDate,desc",
      });
      setNewsPage(0);
      setNews(response.data.content);
    } catch (error) {
      console.error("주요 뉴스 가져오기 실패: ", error.message);
      setError(error);
    } finally {
      setIsLoading(false);
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
      console.error("키워드 뉴스 가져오기 실패: ", error.message);
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
      console.error("주식 순위 가져오기 실패: ", error.message);
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
