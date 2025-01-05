import { useLoaderData, useOutletContext } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { books } from '../data/index';
import { BookList } from '../components/BookList';
import type { AppContext } from '../types/context';

export const loader: LoaderFunction = async () => {
  return { books };
};

export default function Index() {
  const { books } = useLoaderData<typeof loader>();
  const { isDark = false } = useOutletContext<AppContext>();

  const oldTestament = books.slice(0, 39);
  const newTestament = books.slice(39);

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <BookList
          title="舊約聖經"
          books={oldTestament}
          isDark={isDark}
        />
        <BookList
          title="新約聖經"
          books={newTestament}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
