import { json } from '@remix-run/node';
import { useLoaderData, useNavigate, useParams, useOutletContext } from '@remix-run/react';
import { Typography, Select, Button, Space, List, message, Dropdown, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined, CopyOutlined, LinkOutlined, HeartOutlined, HeartFilled, EllipsisOutlined } from '@ant-design/icons';
import { getBookChapters, getChapter, books } from '../data/index';
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { AppContext } from '../types/context';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export async function loader({ params }: LoaderFunctionArgs) {
  const { bookName, chapter } = params;
  const chapters = getBookChapters(bookName as string);
  const chapterData = await getChapter(bookName as string, parseInt(chapter as string));

  if (!chapterData) {
    throw new Response("Not Found!!!", { status: 404 });
  }

  return json({ chapters, chapterData });
}

export default function BibleChapter() {
  const { chapters, chapterData } = useLoaderData<typeof loader>();
  const { bookName, chapter } = useParams();
  const navigate = useNavigate();
  const { isDark } = useOutletContext<AppContext>();
  const [isMobile, setIsMobile] = useState(false); 


  // State for favorites
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteVerses, setFavoriteVerses] = useState<Set<string>>(new Set<string>());

  useEffect(() => {
    // Load favorites from local storage
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
        const favoriteSet = new Set<string>(parsedFavorites.map((fav: any) => `${fav.bookName}-${fav.chapter}-${fav.verseNumber}`));
        setFavoriteVerses(favoriteSet);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }

    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);

    };
    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize); // Cleanup
  }, []);

  // Get the current chapter index
  const currentChapterIndex = parseInt(chapter as string) - 1;
  const currentBookIndex = books.findIndex(book => book.name === bookName);

  // Function to handle previous chapter navigation
  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      navigate(`/bible/${bookName}/${currentChapterIndex}`);
    } else if (currentBookIndex > 0) {
      const previousBookName = books[currentBookIndex - 1].name;
      const previousBookChapters = getBookChapters(previousBookName);
      const lastChapterIndex = previousBookChapters.length - 1;
      navigate(`/bible/${previousBookName}/${lastChapterIndex + 1}`);
    }
  };

  // Function to handle next chapter navigation
  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      navigate(`/bible/${bookName}/${currentChapterIndex + 2}`);
    } else if (currentBookIndex !== -1 && currentBookIndex < books.length - 1) {
      const nextBookName = books[currentBookIndex + 1].name;
      navigate(`/bible/${nextBookName}/1`);
    }
  };

  const handleCopyVerse = (verseText: string) => {
    navigator.clipboard.writeText(verseText).then(() => {
      message.success('經文已複製到剪貼板！');
    });
  };

  const handleCopyUrl = (verseNumber: number) => {
    const url = `${window.location.origin}/bible/${chapterData.bookName}/${chapterData.chapter}#verse-${verseNumber}`;
    navigator.clipboard.writeText(url).then(() => {
      message.success('經文鏈接已複製到剪貼板！');
    });
  };

  const handleAddToFavorites = (verse: string, verseNumber: number) => {
    const verseId = `${bookName}-${chapter}-${verseNumber}`; // Create a unique ID
    const updatedFavorites = [...favorites, { id: verseId, bookName, chapter, verseNumber, content: verse }];
    setFavorites(updatedFavorites); // Update state
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Update local storage
    favoriteVerses.add(verseId); // Add to the set
    setFavoriteVerses(new Set(favoriteVerses)); // Update state
    message.success(`${bookName} ${chapter}:${verseNumber} 已添加到我的最愛！`);
  };

  const toggleFavorite = (verse: string, verseNumber: number) => {
    const verseId = `${bookName}-${chapter}-${verseNumber}`;
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
      handleAddToFavorites(verse, verseNumber);
    }
  };

  const createMenu = (verse: string, verseNumber: number) => [
    {
      key: 'copy',
      label: (
        <button onClick={() => handleCopyVerse(verse)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <CopyOutlined /> 複製經文
        </button>
      ),
    },
    {
      key: 'copyUrl',
      label: (
        <button onClick={() => handleCopyUrl(verseNumber)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <LinkOutlined /> 複製鏈接
        </button>
      ),
    },
  ];

  // TODO: Not working, can check this later
  /* useEffect(() => {
    const hash = window.location.hash; // Get the hash from the URL
    if (hash) {
      const elementId = hash.substring(1); // Remove the '#' from the hash
      const element = document.getElementById(elementId); // Find the element by ID
      if (element) {
        // If the element is found, scroll to it
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log("Element not found for hash:", hash); // Debugging log
      }
    }
  }, []); */

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between">
          <Title level={2} className={`!mb-0 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{bookName}</Title>
          <Select
            value={chapter}
            onChange={(value) => navigate(`/bible/${bookName}/${value}`)}
            options={chapters.map((ch, index) => ({
              label: ch,
              value: (index + 1).toString()
            }))}
            style={{ width: 120 }}
          />
        </div>
        <Space className="mt-1">
          <Button
            type="default"
            disabled={currentBookIndex === 0 && currentChapterIndex === 0} // Disable if it's the first book and first chapter
            onClick={handlePreviousChapter}
            icon={<LeftOutlined />}
          >
            上一章
          </Button>
          <Button
            type="default"
            disabled={currentChapterIndex === chapters.length - 1 && currentBookIndex === books.length - 1}
            onClick={handleNextChapter}
            icon={<RightOutlined />}
            iconPosition="end"
          >
            下一章
          </Button>
        </Space>
        <List
          size="large"
          bordered
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          dataSource={chapterData.verses}
          renderItem={(verse, index) => (
            <List.Item
              id={`verse-${index + 1}`}
              className={`flex ${isMobile ? 'flex-col items-start' : 'justify-between items-start'}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                backgroundColor: favoriteVerses.has(`${bookName}-${chapter}-${index + 1}`)
                  ? (isDark ? '#3a3a3a' : '#fffae6') 
                  : 'transparent', // Highlight favorited verses
              }}
            >
              <div className={`${isDark ? 'text-gray-200' : 'text-gray-800'} ${isMobile ? 'mb-1' : 'mr-4'}`}>
                <span
                  className={`text-gray-500 mr-4`}
                  style={{ flexShrink: 0, textAlign: 'right' }}
                >
                  {`${chapter}:${index + 1}`}
                </span>
              </div>
              {/* Verse Content */}
              <div className={`flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'} ${isMobile ? 'mb-1' : ''}`}>{verse.text}</div>
              {/* Action Buttons */}
              <div className={`flex ${isMobile ? 'gap-1' : 'items-center gap-1'}`}>
                <Button
                  type="text"
                  icon={
                    favoriteVerses.has(`${bookName}-${chapter}-${index + 1}`)
                      ? <HeartFilled style={{ color: 'red' }} />
                      : <HeartOutlined />
                  }
                  onClick={() => toggleFavorite(verse.text, index + 1)}
                />
                <Dropdown menu={{ items: createMenu(verse.text, index + 1) }} trigger={['click']}>
                  <Tooltip title="更多操作">
                    <Button type="text" icon={<EllipsisOutlined />} />
                  </Tooltip>
                </Dropdown>
              </div>
            </List.Item>
          )}
        />
        <Space className="mt-1">
          <Button
            type="default"
            disabled={currentBookIndex === 0 && currentChapterIndex === 0} // Disable if it's the first book and first chapter
            onClick={handlePreviousChapter}
            icon={<LeftOutlined />}
          >
            上一章
          </Button>
          <Button
            type="default"
            disabled={currentChapterIndex === chapters.length - 1 && currentBookIndex === books.length - 1}
            onClick={handleNextChapter}
            icon={<RightOutlined />}
            iconPosition="end"
          >
            下一章
          </Button>
        </Space>
      </div>
    </div>
  );
}