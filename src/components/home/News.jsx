import getNews from "@/api/news/getNews";
import getNewsByKeyword from "@/api/news/getNewsByKeyword";
import { useCallback, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const News = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [animatingIn, setAnimatingIn] = useState(false);
  const [keyword, setKeyword] = useState("전체");

  const keywords = ["전체", "코스닥", "코스피"];

  const fetchNews = useCallback(async () => {
    try {
      const response = await getNews({
        page: 0,
        size: 50,
        sort: "pubDate,desc",
      });
      setPage(0);
      setNews(response.data.content);
    } catch (error) {
      console.error("주요 뉴스 가져오기 실패: ", error.message);
    }
  }, []);

  const fetchNewsByKeyword = useCallback(async () => {
    try {
      const response = await getNewsByKeyword({
        page: 0,
        size: 50,
        sort: "pubDate,desc",
        keyword: keyword,
      });
      setPage(0);
      setNews(response.data.content);
    } catch (error) {
      console.error("키워드 뉴스 가져오기 실패: ", error.message);
    }
  }, [keyword]);

  useEffect(() => {
    if (keyword === "전체") {
      fetchNews();
    } else {
      fetchNewsByKeyword();
    }
  }, [fetchNews, fetchNewsByKeyword, keyword]);

  const decodeHtmlEntities = (text) => {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, "text/html")
      .documentElement.textContent;
    return decodedString;
  };

  const getRelativeTime = (pubDate) => {
    const now = new Date();
    const publishedDate = new Date(pubDate);
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    }
  };

  const handleKeyword = (keyword) => () => {
    setKeyword(keyword);
  };

  const handleNextPage = () => {
    if (animatingOut || animatingIn) return;

    setAnimatingOut(true);

    setTimeout(() => {
      setPage((prevPage) => (prevPage < 4 ? prevPage + 1 : 0));
      setAnimatingOut(false);
      setAnimatingIn(true);

      setTimeout(() => {
        setAnimatingIn(false);
      }, 500);
    }, 500);
  };

  return (
    <NewsContainer>
      <NewsHeader>
        <NewsTitleContainer>
          <NewsContainerTitle>주요 뉴스</NewsContainerTitle>
          <NewsKeywords>
            {keywords.map((el, index) => {
              return (
                <NewsKeyword
                  key={index}
                  $isActive={el === keyword}
                  onClick={handleKeyword(el)}
                >
                  {el}
                </NewsKeyword>
              );
            })}
          </NewsKeywords>
        </NewsTitleContainer>
        <PageIndicators>
          {Array.from({ length: 5 }).map((_, index) => (
            <PageIndicator key={index} $isActive={index === page} />
          ))}
        </PageIndicators>
      </NewsHeader>
      <NewsContents>
        <NewsTransitionContainer
          $animatingOut={animatingOut}
          $animatingIn={animatingIn}
        >
          <NewsColumn>
            {news.slice(page * 10, page * 10 + 5).map((el, index) => {
              return (
                <NewsContent key={index} href={el.link}>
                  <NewsTitle>{decodeHtmlEntities(el.title)}</NewsTitle>
                  <NewsPubDate>{getRelativeTime(el.pubDate)}</NewsPubDate>
                </NewsContent>
              );
            })}
          </NewsColumn>
          <NewsColumn>
            {news.slice(page * 10 + 5, page * 10 + 10).map((el, index) => {
              return (
                <NewsContent key={index} href={el.link}>
                  <NewsTitle>{decodeHtmlEntities(el.title)}</NewsTitle>
                  <NewsPubDate>{getRelativeTime(el.pubDate)}</NewsPubDate>
                </NewsContent>
              );
            })}
          </NewsColumn>
        </NewsTransitionContainer>
        <MoreNewsBtn onClick={handleNextPage}>&gt;</MoreNewsBtn>
      </NewsContents>
    </NewsContainer>
  );
};

export default News;

const NewsContainer = styled.section`
  margin-bottom: 56px;
  width: 100%;
`;

const NewsHeader = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  align-items: center;
  width: 100%;
`;

const NewsTitleContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const NewsContainerTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: #333d4b;
  line-height: 1.45;
`;

const NewsKeywords = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  margin-left: 10px;
`;

const NewsKeyword = styled.div`
  background: #0220470d;
  line-height: 1.45;
  font-size: 15px;
  text-decoration: none;
  padding: 4px 12px;
  cursor: pointer;
  transition: 0.2s;
  border-radius: 20px;
  &:hover {
    font-weight: 700;
    color: #333d4b;
  }
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  color: ${({ $isActive }) => ($isActive ? "#333d4b" : "#4e5968")};
`;
const PageIndicators = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  padding-right: 35px;
`;

const PageIndicator = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${({ $isActive }) => ($isActive ? "#333d4b" : "#ccc")};
  transition: background-color 0.3s ease;
`;

const NewsContents = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const slideOutLeft = keyframes`
  from {
    transform: translateX(0%);
    opacity: 1;
  }
  to {
    transform: translateX(-5%);
    opacity: 0;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(5%);
    opacity: 0;
  }
  to {
    transform: translateX(0%);
    opacity: 1;
  }
`;

const NewsTransitionContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(10px, 1fr) minmax(10px, 1fr);
  column-gap: 12px;
  row-gap: 5px;
  align-items: center;
  overflow: hidden;
  ${({ $animatingOut }) =>
    $animatingOut &&
    css`
      animation: ${slideOutLeft} 0.6s ease-in-out;
    `}

  ${({ $animatingIn }) =>
    $animatingIn &&
    css`
      animation: ${slideInRight} 0.5s ease-in-out;
    `}
`;

const NewsColumn = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const NewsContent = styled.a`
  display: flex;
  gap: 12px;
  align-items: center;
  text-decoration: none;
`;

const NewsTitle = styled.span`
  font-weight: 500;
  color: #333d4b;
  line-height: 1.45;
  font-size: 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  &:hover {
    font-weight: 700;
    color: #333d4b;
  }
`;

const NewsPubDate = styled.span`
  font-weight: 500;
  color: #6b7684;
  line-height: 1.45;
  font-size: 14px;
  padding-right: 28px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const MoreNewsBtn = styled.a`
  font-weight: 500;
  color: #4e5968;
  line-height: 1.45;
  font-size: 25px;
  text-decoration: none;
  padding: 0 min(max(6px, 0.4em), 8px);
  cursor: pointer;
  transition: 0.2s;
  border-radius: 6px;
  &:hover {
    font-weight: 700;
    color: #333d4b;
  }
`;
