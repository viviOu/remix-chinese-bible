import { useState, useEffect } from 'react';
import { Outlet, useLocation } from '@remix-run/react';
import { Layout as AntLayout, Switch, theme, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  FontSizeOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
import { SideMenu } from '../components/SideMenu';
import { useFontSize } from '../contexts/FontSizeContext';
import { Breadcrumb } from './Breadcrumb';

const { Header, Sider, Content } = AntLayout;
const { useToken } = theme;

interface LayoutProps {
  isDark: boolean;
  onThemeChange: (dark: boolean) => void;
  children?: React.ReactNode;
}

export default function Layout(props: Readonly<LayoutProps>) {
  const { isDark, onThemeChange } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { token } = useToken();
  const { fontSize, setFontSize } = useFontSize();

  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const fontSizeItems = [
    {
      key: 'default',
      label: (
        <div className="flex items-center gap-2">
          <FontSizeOutlined />
          <span>預設大小 (14px)</span>
        </div>
      ),
    },
    {
      key: 'large',
      label: (
        <div className="flex items-center gap-2">
          <ZoomInOutlined />
          <span>放大 1.3x (18px)</span>
        </div>
      ),
    },
    {
      key: 'xlarge',
      label: (
        <div className="flex items-center gap-2">
          <ZoomInOutlined className="text-lg" />
          <span>放大 1.6x (22px)</span>
        </div>
      ),
    },
  ];

  const getBreadcrumbItems = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items = [];

    if (paths.length > 0) {
      switch (paths[0]) {
        case 'bible':
          items.push({ title: '聖經閱讀', path: '/bible' });
          if (paths.length > 1) {
            const bookName = decodeURIComponent(paths[1]);
            items.push({ title: bookName, path: `/bible/${encodeURIComponent(bookName)}` });
            if (paths.length > 2) {
              items.push({ title: `第 ${paths[2]} 章`, path: `/bible/${encodeURIComponent(bookName)}/${paths[2]}` });
            }
          }
          break;
        case 'about':
          items.push({ title: '關於我們', path: '/about' });
          break;
        case 'daily':
          items.push({ title: '每日經文', path: '/daily' });
          break;
        case 'search':
          items.push({ title: '經文搜尋', path: '/search' });
          break;
        case 'history':
          items.push({ title: '閱讀歷史', path: '/history' });
          break;
        case 'favorites':
          items.push({ title: '我的收藏', path: '/favorites' });
          break;
        default:
          items.push({ title: paths.join(' / '), path: location.pathname });
          break;
      }
    }

    return items;
  };

  return (
    <AntLayout className="min-h-screen">
      <Header
        className="fixed w-full z-50 flex flex-col"
        style={{
          background: token.colorBgContainer,
          boxShadow: token.boxShadowSecondary,
          height: 'auto',
          padding: '0',
        }}
      >
        <div className="h-14 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: token.colorText }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <div className="ml-4 flex items-center gap-3">
              <img
                src="/CFCC-logo-192x192.png"
                alt="CFCC Logo"
                className="h-8 w-8"
              />
              <span
                className="text-lg font-semibold hidden md:block"
                style={{ color: token.colorText }}
              >
                中文聖經和合本
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Dropdown
              menu={{
                items: fontSizeItems,
                selectedKeys: [fontSize],
                onClick: ({ key }) => setFontSize(key as 'default' | 'large' | 'xlarge'),
              }}
            >
              <button
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors
                  ${isDark
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-gray-200 dark:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <FontSizeOutlined />
                <span>字體</span>
              </button>
            </Dropdown>

            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span style={{ color: token.colorTextSecondary }}>
                {isDark ? <MoonOutlined /> : <SunOutlined />}
              </span>
              <Switch
                checked={isDark}
                onChange={onThemeChange}
                checkedChildren="暗"
                unCheckedChildren="亮"
                size="small"
                style={{
                  backgroundColor: isDark ? token.colorPrimary : undefined
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="px-4 md:px-6 py-2"
          style={{
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'
          }}
        >
          <Breadcrumb
            items={getBreadcrumbItems()}
            isDark={isDark}
          />
        </div>
      </Header>

      <AntLayout style={{
        marginTop: 88,
      }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth="0"
          width={isMobile ? 48 : 240}
          onBreakpoint={(broken: boolean) => {
            setCollapsed(broken);
          }}
          style={{
            backgroundColor: token.colorBgContainer,
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            height: 'calc(100vh - 56px)',
            position: 'fixed',
            left: 0,
            top: 56,
            zIndex: 40,
          }}
        >
          <SideMenu
            isDark={isDark}
            currentPath={location.pathname}
          />
        </Sider>

        <AntLayout
          style={{
            marginLeft: collapsed ? 0 : (isMobile ? 48 : 240),
            transition: 'margin-left 0.2s',
          }}
          className={isDark ? 'bg-gray-800' : 'bg-gray-100'}
        >
          <Content
            className={`
              m-4 p-6 min-h-[280px] rounded-lg transition-all duration-300
              ${isDark ? 'bg-gray-900' : 'bg-white'}
            `}
          >
            <Outlet context={{ isDark }} />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
}
