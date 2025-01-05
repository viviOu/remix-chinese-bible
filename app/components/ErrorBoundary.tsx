import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    // Specific handling for known Remix route errors
    if (error.status === 404) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
        >
          <Result
            status="404"
            title="錯誤 404"
            subTitle="抱歉，找不到您訪問的頁面。"
            extra={
              <Link to="/">
                <Button type="primary">返回首頁</Button>
              </Link>
            }
          />
        </div>
      );
    }
  }

  // Generic handling for unexpected errors
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
    >
      <Result
        status="500"
        title="未知錯誤"
        subTitle="系統發生未知錯誤，請稍後再試。"
        extra={
          <Link to="/">
            <Button type="primary">返回首頁</Button>
          </Link>
        }
      />
    </div>
  );
}
