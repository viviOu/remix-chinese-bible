import { useEffect, useState } from 'react';
import { List, Button, Dropdown, Typography, message, Empty, Spin, Tooltip, Pagination } from 'antd';
import { CopyOutlined, DeleteOutlined, EllipsisOutlined, ReadOutlined } from '@ant-design/icons';
import { useOutletContext, useNavigate } from '@remix-run/react';
import type { AppContext } from '../types/context';

const { Title } = Typography;

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark = false } = useOutletContext<AppContext>();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [isMobile, setIsMobile] = useState(false); // Track if it's a mobile view

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }

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
  }, []);

  const handleRemoveFavorite = (verse: any) => {
    const updatedFavorites = favorites.filter(fav => fav !== verse);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    message.success('經文已從我的最愛中移除！');
  };

  const handleCopyVerse = (verse: string) => {
    navigator.clipboard.writeText(verse).then(() => {
      message.success('經文已複製到剪貼板！');
    });
  };

  const handleNavigateToChapter = (verse: any) => {
    navigate(`/bible/${verse.bookName}/${verse.chapter}`);
    message.success('跳轉到章節成功！');
  };

  const createMenu = (verse: any) => [
    {
      key: 'goToChapter',
      label: (
        <button onClick={() => handleNavigateToChapter(verse)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <ReadOutlined /> 跳轉到章節
        </button>
      ),
    },
    {
      key: 'copy',
      label: (
        <button onClick={() => handleCopyVerse(verse.content)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <CopyOutlined /> 複製經文
        </button>
      ),
    },
    {
      key: 'remove',
      label: (
        <button onClick={() => handleRemoveFavorite(verse)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <DeleteOutlined /> 從我的最愛移除
        </button>
      ),
    },
  ];

  // Paginate favorites based on current page and page size
  const paginatedFavorites = favorites.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize) {
      setPageSize(newPageSize);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large"/>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="text-center">
          <Title level={2} className={isDark ? 'text-gray-200' : 'text-gray-800'}>我的收藏</Title>
        </div>

        {favorites.length > 0 ? (
          <>
            <div className="flex justify-end">
              <Pagination
                className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                current={currentPage}
                pageSize={pageSize}
                simple={isMobile}
                total={favorites.length}
                onChange={handlePageChange}
                showSizeChanger={!isMobile} // Hide page size changer for mobile
                pageSizeOptions={['5', '10', '20', '50']}
                locale={{ items_per_page: '經文每頁' }}
              />
            </div>
            <List
              size="large"
              bordered
              dataSource={paginatedFavorites}
              className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
              renderItem={(verse) => (
                <List.Item
                  className={`flex ${isMobile ? 'flex-col items-start' : 'justify-between items-start'}`}
                  style={{
                    backgroundColor: isDark ? '#3a3a3a' : 'transparent',
                    alignItems: 'flex-start',
                  }}
                >
                  <div className={`${isDark ? 'text-gray-200' : 'text-gray-800'} ${isMobile ? 'mb-1' : 'mr-4'}`}>
                    <span
                      className={`text-gray-500 mr-4`}
                      style={{ flexShrink: 0, textAlign: 'right' }}
                    >
                      {verse.bookName} {verse.chapter} : {verse.verseNumber}
                    </span>
                  </div>
                  {/* Verse Content */}
                  <div className={`flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'} ${isMobile ? 'mb-1' : ''}`}>
                    {verse.content}
                  </div>
                  {/* Actions */}
                  <div className={`flex ${isMobile ? 'gap-1' : 'items-center gap-1'}`}>
                  <Dropdown menu={{ items: createMenu(verse) }} trigger={['click']}>
                    <Tooltip title="更多操作">
                      <Button type="text" size="small" className="flex items-center" icon={<EllipsisOutlined />} />
                    </Tooltip>
                  </Dropdown>
                  </div>
                </List.Item>
              )}
            />
            <div className="flex justify-end">
              <Pagination
                className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                current={currentPage}
                pageSize={pageSize}
                simple={isMobile}
                total={favorites.length}
                onChange={handlePageChange}
                showSizeChanger={!isMobile} // Hide page size changer for mobile
                pageSizeOptions={['5', '10', '20', '50']}
                locale={{ items_per_page: '經文每頁' }}
              />
            </div>
          </>
        ) : (
          <div className="text-center">
            <Empty
              description={<span className={isDark ? 'text-gray-400' : 'text-gray-600'}>目前沒有加入收藏的經文</span>}
            />
          </div>
        )}
      </div>
    </div>
  );
}
