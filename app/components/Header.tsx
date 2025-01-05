import { Layout, Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  isDark: boolean;
  onThemeChange: (dark: boolean) => void;
}

export default function Header(props: Readonly<HeaderProps>) {
  const { isDark, onThemeChange } = props;
  return (
    <AntHeader className={`
      fixed w-full z-10 flex items-center justify-between px-4
      ${isDark ? 'bg-gray-900/90' : 'bg-white/90'}
      backdrop-blur-sm transition-colors duration-300 border-b
      ${isDark ? 'border-gray-800' : 'border-gray-100'}
    `}>
      <h1 className={`
        text-lg font-semibold
        ${isDark ? 'text-gray-100' : 'text-gray-800'}
      `}>
        中文聖經和合本
      </h1>
      <Switch
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
        checked={isDark}
        onChange={onThemeChange}
      />
    </AntHeader>
  );
}