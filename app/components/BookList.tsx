import { List, Typography, Space } from 'antd';
import { useNavigate } from '@remix-run/react';
import {
  RightOutlined,
} from '@ant-design/icons';
import type { BookInfo } from '../data/data';

interface BookListProps {
  books: Array<BookInfo>;
  title: string;
  isDark?: boolean;
}

export function BookList(props: Readonly<BookListProps>) {
  const { books, title, isDark } = props;
  const navigate = useNavigate();

  return (
    <div>
      <Typography.Title level={2} className={`mb-4 ${isDark ? '!text-gray-200' : '!text-gray-700'}`}>
        {title}
      </Typography.Title>
      <List
        size="large"
        bordered
        className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
        dataSource={books}
        renderItem={(book, index) => (
          <List.Item
            className={isDark ? 'hover:bg-gray-700 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'}
            style={{ cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'space-between', textDecoration: 'none', color: 'inherit' }}
            onClick={() => {
              navigate(`/bible/${book.name}/1`);
            }}
          >
            <Space className="items-center">
              <span className={`w-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {index + 1}.
              </span>
              <span className={isDark ? 'text-gray-300' : ''}>
                {book.name}
              </span>
            </Space>
            <span className={`text-gray-500 ${isDark ? '!text-gray-400' : ''}`}>
              {book.chapterNum} 章 <RightOutlined />
            </span>
          </List.Item>
        )}
      />
    </div>
  );
}