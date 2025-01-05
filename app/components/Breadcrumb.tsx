import { Link } from '@remix-run/react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  isDark?: boolean;
}

export function Breadcrumb(props: Readonly<BreadcrumbProps>) {
  const { items, isDark } = props;

  // Transform items into the new format required by Ant Design
  const breadcrumbItems = [
    {
      key: 'home',
      title: (
        <Link to="/" className="flex items-center">
          <HomeOutlined className={isDark ? 'text-gray-400' : 'text-gray-600'} />
        </Link>
      ),
    },
    ...items.map((item, index) => ({
      key: `${index}-${item.title}`,
      title: item.path ? (
        <Link
          to={item.path}
          className={isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}
        >
          {item.title}
        </Link>
      ) : (
        <span className={isDark ? 'text-gray-200' : 'text-gray-900'}>{item.title}</span>
      ),
    })),
  ];

  return <AntBreadcrumb items={breadcrumbItems} className="mb-6" />;
}