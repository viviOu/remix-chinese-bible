import { useOutletContext } from '@remix-run/react';
import { Typography, Card, Button} from 'antd';
import {
  YoutubeOutlined,
  GlobalOutlined,
  FacebookOutlined
} from '@ant-design/icons';
import type { AppContext } from '../types/context';

const { Title, Paragraph } = Typography;

export default function About() {
  const { isDark = false } = useOutletContext<AppContext>();

  const socialLinks = [
    {
      icon: <YoutubeOutlined />,
      title: '中文部主頻道',
      link: 'https://youtube.com/@CFCCHayard/featured',
      color: '#ff0000'
    },
    {
      icon: <YoutubeOutlined />,
      title: '英文部頻道',
      link: 'https://youtube.com/@cfccofhayward/featured',
      color: '#ff0000'
    },
    {
      icon: <YoutubeOutlined />,
      title: '愛與讚美的聖殿',
      link: 'https://www.youtube.com/@HaywardChineseChurch',
      color: '#ff0000'
    },
    {
      icon: <GlobalOutlined />,
      title: '教會網站',
      link: 'https://cfcchayward.org',
      color: '#1677ff'
    },
    {
      icon: <FacebookOutlined />,
      title: '臉書群組',
      link: 'https://facebook.com/groups/cfcchayward',
      color: '#1877f2'
    },
    {
      icon: <FacebookOutlined />,
      title: '臉書專頁',
      link: 'https://facebook.com/cfcchayward',
      color: '#1877f2'
    },
    {
      icon: <FacebookOutlined />,
      title: '愛與讚美的聲音專頁',
      link: 'https://facebook.com/profile.php?id=61566387063686',
      color: '#1877f2'
    }
  ];

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        <div className="text-center mb-12">
          <div className="bg-gray-900 rounded-lg p-8 mb-8 inline-block">
            <img
              src="/CFCC-logo-big.png"
              alt="CFCC Logo"
              className="mx-auto max-w-[300px] w-full"
            />
          </div>
          <Title level={1} className={isDark ? 'text-gray-200' : 'text-gray-800'}>
            中華歸主海沃教會
          </Title>
          <Title level={2} className={`!mt-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Chinese for Christ Church of Hayward
          </Title>
        </div>

        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <Paragraph className="text-lg leading-relaxed">
            中華歸主海沃教會是由一群愛主的基督徒在80年代所建立的華人教會，由於歷任忠心愛主的牧者周淑慧牧師、吳德聖牧師、焦源濂牧師、區永亮牧師、季養正牧師、黃嘉松牧師等的擺上，教會興旺成長為忠於聖經，重視宣教的教會。
          </Paragraph>
          <Paragraph className="text-lg leading-relaxed">
            現在海沃教會由中文牧師葉耿齊（Roy Yeh）牧師、張麗麗（Lili Zhang）牧師、英文牧者 Joshua Lee（李龍山）牧師與 DANIEL TAI (戴得人) 牧師帶領，會友來自於中國、台灣、香港、東南亞等地，居住於 Hayward 市及鄰近城市 San Leandro, San Lorenzo, Castro Valley, Pleasanton, Dublin, San Ramon, Oakland, Piedmont, Union City, Newark, Fremont，是充滿主愛的大家庭。
          </Paragraph>
          <Paragraph className="text-lg leading-relaxed">
            在舊金山灣區的東灣，我們齊心宣傳耶穌的名，興旺福音！歡迎您來訪拜我們，彼此團契，一同來敬拜主！
          </Paragraph>
        </Card>

        <div className="space-y-4">
          <div className="text-center">
            <Title level={3} className={`!mb-2 ${isDark ? 'text-gray-200' : ''}`}>
              我們的社群媒體
            </Title>
            <div className={`w-20 h-1 mx-auto rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
          </div>

          <Card
            className={`${isDark ? 'bg-gray-800 border-gray-700' : ''} overflow-hidden`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="font-medium mb-2 text-lg">YouTube 頻道</div>
                {socialLinks
                  .filter(item => item.icon.type === YoutubeOutlined)
                  .map((item, index) => (
                    <Button
                      key={index}
                      type="default"
                      icon={item.icon}
                      href={item.link}
                      target="_blank"
                      size="large"
                      className={`
                        w-full flex items-center gap-2 transition-all
                        hover:scale-102 hover:shadow-md
                        ${isDark ? 'bg-red-900/30 border-red-800 hover:bg-red-900/50' : 'bg-red-50 border-red-100 hover:bg-red-100'}
                      `}
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </Button>
                  ))}
              </div>

              <div className="space-y-4">
                <div className="font-medium mb-2 text-lg">社群平台</div>
                {socialLinks
                  .filter(item => item.icon.type !== YoutubeOutlined)
                  .map((item, index) => (
                    <Button
                      key={index}
                      type="default"
                      icon={item.icon}
                      href={item.link}
                      target="_blank"
                      size="large"
                      className={`
                        w-full flex items-center gap-2 transition-all
                        hover:scale-102 hover:shadow-md
                        ${isDark
                          ? item.icon.type === FacebookOutlined
                            ? 'bg-blue-900/30 border-blue-800 hover:bg-blue-900/50'
                            : 'bg-cyan-900/30 border-cyan-800 hover:bg-cyan-900/50'
                          : item.icon.type === FacebookOutlined
                            ? 'bg-blue-50 border-blue-100 hover:bg-blue-100'
                            : 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100'
                        }
                      `}
                      style={{ color: item.color }}
                    >
                      {item.title}
                    </Button>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}