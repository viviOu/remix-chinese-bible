import { useState, useEffect, useTransition } from 'react';
import { Input, List, Button, Select, Pagination, message, Typography, Space, Collapse, Tag, Tooltip, Dropdown, Spin } from 'antd';
import { CopyOutlined, SearchOutlined, CloseOutlined, EllipsisOutlined, LinkOutlined, HeartOutlined, HeartFilled, ReadOutlined } from '@ant-design/icons';
import { useOutletContext, useNavigate, useSearchParams, json, useLoaderData } from '@remix-run/react';
import type { AppContext } from '../types/context';
import { getBibleVerses, books } from '../data/index';

const { Title } = Typography;
const { Option } = Select;

interface LoaderData {
  keyword: string;
  searchHistory: string[];
}

// Can't fetch local storage data here because it's client side data
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword') || '';

  return json({
    keyword,
  });
}

export default function SearchPage() {
  const loaderData = useLoaderData<LoaderData>();
  const [keyword, setKeyword] = useState(loaderData.keyword || '');
  const [selectedBook, setSelectedBook] = useState('all');
  const [verses, setVerses] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteVerses, setFavoriteVerses] = useState<Set<string>>(new Set<string>());
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { isDark = false } = useOutletContext<AppContext>();
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const [_, setSearchParams] = useSearchParams();
  const [ isPending ] = useTransition();
  const [isInitialDataReady, setIsInitialDataReady] = useState(false);
  const [currentSearchedKeyword, setCurrentSearchedKeyword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Load search history from localStorage
        const storedHistory = localStorage.getItem('searchHistory');
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          setSearchHistory(parsedHistory);
        }

        // Load favorites from local storage
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavorites(parsedFavorites);
          const favoriteSet = new Set(parsedFavorites.map((fav: any) => `${fav.bookName}-${fav.chapter}-${fav.verseNumber}`));
          setFavoriteVerses(favoriteSet as Set<string>);
        }

        // load the bible verses
        const allVerses = await getBibleVerses();
        setVerses(allVerses);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        // setIsLoading(false); // All data loaded
        setIsInitialDataReady(true);
      }
    };

    fetchData();

    // Add event listener to track window resize for mobile detection
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);

      // Adjust page size for mobile/desktop
      setPageSize(isNowMobile ? 5 : 10);
    };
    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialDataReady) return; // Wait until data is ready

    const performInitialSearch = async () => {
      try {
        if (loaderData.keyword.trim()) {
          performSearch(loaderData.keyword);
        }
      } catch (error) {
        console.error('Error performing initial search:', error);
      } finally {
        setIsLoading(false); // Loading complete
      }
    };

    performInitialSearch();
  }, [isInitialDataReady, loaderData.keyword]);

  const performSearch = (searchKeyword: string, allVerses = verses) => {
    const filteredResults = allVerses.filter(verse => {
      const matchesKeyword = verse.content.includes(searchKeyword);
      const matchesBook = selectedBook === 'all' || verse.book === selectedBook;
      return matchesKeyword && matchesBook;
    });

    setCurrentSearchedKeyword(searchKeyword);
    setResults(filteredResults);
    setTotalResults(filteredResults.length);
    setCurrentPage(1);

    // Add to search history if not already present
    if (!searchHistory.includes(searchKeyword)) {
      const updatedHistory = [...searchHistory, searchKeyword];
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
  };

  const handleSearch = () => {
    if (!keyword.trim()) return; // Exit if no keyword
    setSearchParams({ keyword }); // Update URL with the new keyword
    performSearch(keyword);
  };

  const handleSearchFromHistory = (historyKeyword: string) => {
    setKeyword(historyKeyword);
    setSearchParams({ keyword: historyKeyword }); // Update URL with the selected keyword
    performSearch(historyKeyword);
  };

  const handleRemoveFromHistory = (keywordToRemove: string) => {
    const updatedHistory = searchHistory.filter(item => item !== keywordToRemove);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory)); // Update local storage
  };

  const paginatedResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize) {
      setPageSize(newPageSize);
    }
  };

  const handleAddToFavorites = (bookName: string, chapterNumber: number, verse: string, verseNumber: number) => {
    const verseId = `${bookName}-${chapterNumber}-${verseNumber}`; // Create a unique ID
    const updatedFavorites = [...favorites, { id: verseId, bookName, chapter: chapterNumber, verseNumber, content: verse }];
    setFavorites(updatedFavorites); // Update state
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update local storage
    favoriteVerses.add(verseId); // Add to the set
    setFavoriteVerses(new Set(favoriteVerses)); // Update state
    message.success(`${bookName} ${chapterNumber}:${verseNumber} 已添加到我的最愛！`);
  };

  const toggleFavorite = (bookName: string, chapterNumber: number, verse: string, verseNumber: number) => {
    const verseId = `${bookName}-${chapterNumber}-${verseNumber}`;
    if (favoriteVerses.has(verseId)) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(fav => fav.id !== verseId); // Filter out the verse
      setFavorites(updatedFavorites); // Update state
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update local storage
      favoriteVerses.delete(verseId); // Remove from the set
      setFavoriteVerses(new Set(favoriteVerses)); // Update state
      message.success('經文已從我的最愛中移除！');
    } else {
      // Add to favorites
      handleAddToFavorites(bookName, chapterNumber, verse, verseNumber);
    }
  }

  const createMenu = (verse: any) => [
    {
      key: 'goToChapter',
      label: (
        <button
          onClick={() => {
            navigate(`/bible/${verse.book}/${verse.chapter.split(' ')[1]}#verse-${verse.section.split(' ')[1]}`);
            message.success('跳轉到章節成功！');
          }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
        >
          <ReadOutlined /> 跳轉到章節
        </button>
      ),
    },
    {
      key: 'copy',
      label: (
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${verse.book} ${verse.chapter}:${verse.section} ${verse.content}`);
            message.success('經文已複製到剪貼板！');
          }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
        >
          <CopyOutlined /> 複製經文
        </button>
      ),
    },
    {
      key: 'copyUrl',
      label: (
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/bible/${verse.book}/${verse.chapter.split(' ')[1]}#verse-${verse.section.split(' ')[1]}`);
            message.success('鏈接已複製到剪貼板！');
          }}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
        >
          <LinkOutlined /> 複製鏈接
        </button>
      ),
    },
  ];

  const highlightKeyword = (text: string) => {
    const regex = new RegExp(`(${currentSearchedKeyword.trim()})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className={`${
            isDark
              ? 'bg-blue-500 text-white' // Soft blue for dark mode
              : 'bg-yellow-300 text-black' // Yellow for light mode
          } px-1 rounded`}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (isLoading || isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center">
          <Title level={2} className={isDark ? 'text-gray-200' : 'text-gray-800'}>
            <SearchOutlined /> 經文搜索
          </Title>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="請輸入關鍵字進行搜索 (例如: 神, 愛, 生命)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch} // Trigger search on Enter key
            className={`${isDark ? 'bg-gray-800 text-gray-200' : ''}`}
            prefix={<SearchOutlined />}
          />
          <Select
            value={selectedBook}
            onChange={setSelectedBook}
            style={{ minWidth: 200 }}
            className={`${isDark ? 'bg-gray-800 text-gray-200' : ''}`}
          >
            <Option value="all">全部書卷</Option>
            {books.map((book) => (
              <Option key={book.name} value={book.name}>
                {book.name}
              </Option>
            ))}
          </Select>
          <Button onClick={handleSearch} type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
        </div>

        <Collapse
          items={[
            {
              key: '1',
              label: '搜索歷史',
              children: (
                <Space wrap>
                  {searchHistory.length > 0 ? (
                    searchHistory.map((item) => (
                      <Tag
                        key={item}
                        color={isDark ? 'geekblue' : 'blue'}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          paddingRight: 0,
                        }}
                      >
                        <Tooltip title="點擊以再次搜索">
                          <Space onClick={() => handleSearchFromHistory(item)} style={{ cursor: 'pointer' }}>
                            <SearchOutlined style={{ cursor: 'pointer' }} />
                            <span>{item}</span>
                          </Space>
                        </Tooltip>
                        <Tooltip title="刪除">
                          <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => handleRemoveFromHistory(item)}
                            style={{
                              color: isDark ? '#fff' : '#000',
                              marginLeft: 8,
                              padding: 0,
                            }}
                          />
                        </Tooltip>
                      </Tag>
                    ))
                  ) : (
                    <Typography.Text type="secondary" style={{ marginTop: 10 }}>
                      暫無搜索歷史
                    </Typography.Text>
                  )}
                </Space>
              ),
            },
          ]}
        />

        <h3 className={isDark ? 'text-gray-200' : 'text-gray-800'}>搜索結果: {totalResults}</h3>

        {/* Pagination at the top right */}
        <div className="flex justify-end">
          <Pagination
            className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}
            current={currentPage}
            pageSize={pageSize}
            simple={isMobile}
            total={totalResults}
            onChange={handlePageChange}
            showSizeChanger={!isMobile} // Hide page size changer for mobile
            pageSizeOptions={['5', '10', '20', '50']}
            locale={{ items_per_page: '經文每頁' }}
          />
        </div>

        <List
          bordered
          dataSource={paginatedResults}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          renderItem={verse => (
            <List.Item 
              className={`flex ${isMobile ? 'flex-col items-start' : 'justify-between items-start'}`}
              style={{
                alignItems: 'flex-start',
              }}
            >
              {/* Verse Title */}
              <div className={`${isDark ? 'text-gray-200' : 'text-gray-800'} ${isMobile ? 'mb-1' : 'mr-4'}`}>
                <span className={`text-gray-500 mr-1`}>
                  {verse.book} {verse.chapter.split(' ')[1]}:{verse.section.split(' ')[1]}
                </span>
              </div>

              {/* Verse Content */}
              <div className={`flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'} ${isMobile ? 'mb-1' : ''}`}>
                {highlightKeyword(verse.content)}
              </div>

              {/* Actions */}
              <div className={`flex ${isMobile ? 'gap-1' : 'items-center gap-1'}`}>
                <Button
                  type="text"
                  icon={
                    favoriteVerses.has(`${verse.book}-${verse.chapter.split(' ')[1]}-${verse.section.split(' ')[1]}`)
                      ? <HeartFilled style={{ color: 'red' }} />
                      : <HeartOutlined />
                  }
                  onClick={() => toggleFavorite(verse.book, verse.chapter.split(' ')[1], verse.content, verse.section.split(' ')[1])}
                />
                <Dropdown menu={{ items: createMenu(verse) }} trigger={['click']}>
                  <Tooltip title="更多操作">
                    <Button type="text" icon={<EllipsisOutlined />} />
                  </Tooltip>
                </Dropdown>
              </div>
            </List.Item>
          )}
        />

        {/* Pagination at the bottom right */}
        <div className="flex justify-end">
          <Pagination
            className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}
            current={currentPage}
            pageSize={pageSize}
            simple={isMobile}
            total={totalResults}
            onChange={handlePageChange}
            showSizeChanger={!isMobile} // Hide page size changer for mobile
            pageSizeOptions={['5', '10', '20', '50']}
            locale={{ items_per_page: '經文每頁' }}
          />
        </div>
      </div>
    </div>
  );
}
