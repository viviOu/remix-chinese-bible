import { Typography, Card, Button } from 'antd';
import { Link, useOutletContext } from '@remix-run/react';
import type { AppContext } from '../types/context';
import { ReadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function BibleIndex() {
  const { isDark } = useOutletContext<AppContext>();

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        <div className="text-center mb-12">
          <Title level={1} className={isDark ? 'text-gray-200' : 'text-gray-800'}>
            歡迎來到聖經閱讀網站
          </Title>
          <Title level={2} className={`!mt-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            一起探索神話語的智慧
          </Title>
        </div>

        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <Paragraph className="text-lg leading-relaxed">
            很高興您來到這裡！這是您閱讀和探索聖經的空間，無論是深入學習還是靈修默想。
          </Paragraph>
          <Paragraph className="text-lg leading-relaxed">
            願神的話語帶給您啟發與平安，也歡迎您與他人分享閱讀的心得。
          </Paragraph>
          <div className="text-center mt-4">
            <Link to="/bible" style={{ textDecoration: 'none' }}>
              <Button
                type="primary"
                size="large"
                icon={<ReadOutlined />}
                shape="round"
              >
                開始閱讀聖經
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}