import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import { StyleProvider } from '@ant-design/cssinjs';
import { FontSizeProvider, useFontSize } from './contexts/FontSizeContext';

import Layout from "./components/Layout";
import { ErrorBoundary as ErrorBoundaryComponent } from "./components/ErrorBoundary";
import "antd/dist/reset.css";
import "./styles/tailwind.css";

export const future = {
  v3_relativeSplatPath: true,
};

function AppContent() {
  const [isDark, setIsDark] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { fontSize } = useFontSize();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme === 'dark');
    setIsHydrated(true);
  }, []);

  // Save theme preference to localStorage
  const handleThemeChange = (dark: boolean) => {
    setIsDark(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  return (
    <html lang="zh-TW" className={isDark ? 'dark' : ''}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/CFCC-logo-192x192.png" />
        <Meta />
        <Links />
        <title>中文聖經</title>
        <style dangerouslySetInnerHTML={{ __html: `
          .loading { display: none; }
          .hydrated .loading { display: block; }
          :root {
            background: ${isDark ? '#141414' : '#f5f5f5'};
            transition: background 0.3s;
          }
        `}} />
      </head>
      <body className={isHydrated ? 'hydrated' : 'loading'}>
        <StyleProvider hashPriority="high">
          <ConfigProvider
            locale={zhTW}
            theme={{
              algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
              token: {
                colorPrimary: '#1677ff',
                colorInfo: '#faad14',
                colorSuccess: '#52c41a',
                colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
                colorBgLayout: isDark ? '#141414' : '#f7f9fc',
                borderRadius: 8,
                colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : '#2c3e50',
                colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : '#34495e',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                fontSize: fontSize === 'default' ? 14 : fontSize === 'large' ? 18 : 22,
              },
              components: {
                Typography: {
                  fontSize: fontSize === 'default' ? 14 : fontSize === 'large' ? 18 : 22,
                }
              }
            }}
          >
            <Layout isDark={isDark} onThemeChange={handleThemeChange}>
              <Outlet />
            </Layout>
          </ConfigProvider>
        </StyleProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/CFCC-logo-192x192.png" />
        <Meta />
        <Links />
        <title>中文聖經</title>
        <style>{`
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          .error-container {
            text-align: center;
          }
        `}</style>
      </head>
      <body>
        <div className="error-container">
          <StyleProvider hashPriority="high">
            <ConfigProvider
              locale={zhTW}
              theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                  colorPrimary: '#1677ff',
                  colorBgContainer: '#ffffff',
                  colorText: '#2c3e50',
                },
              }}
            >
              <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <ErrorBoundaryComponent />
              </div>
            </ConfigProvider>
          </StyleProvider>
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <FontSizeProvider>
      <AppContent />
    </FontSizeProvider>
  );
}
