import { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link } from '@remix-run/react';
import {
  BookOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  HeartFilled,
  HomeOutlined
} from '@ant-design/icons';

interface SideMenuProps {
  isDark: boolean;
  currentPath: string;
}

export function SideMenu(props: Readonly<SideMenuProps>) {
  const { currentPath } = props;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkWidth();

    // Add event listener
    window.addEventListener('resize', checkWidth);

    // Cleanup
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/" className="flex items-center gap-2">
        <span className="hidden md:inline">首頁</span>
      </Link>,
      title: '',
    },
    {
      key: '/bible',
      icon: <BookOutlined className="text-amber-600" />,
      label: <Link to="/bible" className="flex items-center gap-2">
        <span className="hidden md:inline">聖經閱讀</span>
      </Link>,
      title: '',
    },
    {
      key: '/search',
      icon: <SearchOutlined className="text-blue-600" />,
      label: <Link to="/search" className="flex items-center gap-2">
        <span className="hidden md:inline">經文搜尋</span>
      </Link>,
      title: '',
    },
    {
      key: '/favorites',
      icon: <HeartFilled style={{ color: 'red' }} />,
      label: <Link to="/favorites" className="flex items-center gap-2">
        <span className="hidden md:inline">我的收藏</span>
      </Link>,
      title: '',
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined className="text-cyan-600" />,
      label: <Link to="/about" className="flex items-center gap-2">
        <span className="hidden md:inline">關於我們</span>
      </Link>,
      title: '',
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[currentPath]}
      items={menuItems}
      className="border-none"
      style={{
        backgroundColor: 'transparent',
        width: isMobile ? 48 : 240,
      }}
      inlineCollapsed={isMobile}
    />
  );
}