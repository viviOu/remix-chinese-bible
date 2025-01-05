import type { BookInfo, BookEntry, BibleData, BibleArray } from './data';
import booksJson from './books.json';
import bibleArrayJson from './bible-array.json';
import booksListJson from './bookslist.json';
import bibleDataMap from './bible.json';

// Type assertion for the imported JSON
export const books = booksJson as BookInfo[];
export const booksList = booksListJson as BookEntry[];
export const bibleData = bibleDataMap as BibleData;
export const bibleArray = bibleArrayJson as BibleArray;

// Function to get all verses from bible-array.json
export const getBibleVerses = async (): Promise<BibleArray> => {
  return bibleArray; // Return the entire array of verses
};

// Function to get chapters for a specific book
export function getBookChapters(bookName: string): string[] {
  const chapters = booksList.find(book => book[bookName] !== undefined);
  return chapters ? (chapters[bookName] as string[]) : [];
}

// Get chapter data
export async function getChapter(bookName: string, chapter: number) {
  // Access the specific book and chapter directly from bibleData
  const chapterKey = `第 ${chapter} 章`;
  const verses = bibleData[bookName]?.[chapterKey];

  // If no verses are found, return null
  if (!verses) return null;

  // Return an object containing the book name, chapter number, and the verses
  return {
    bookName,
    chapter,
    verses: verses.map(v => ({
      verse: v.section, // The verse number (e.g., "第 1 節")
      text: v.content   // The content of the verse
    }))
  };
}

// Function to get verses for a specific book
export const getVersesByBook = (bookName: string) => {
  return bibleArray.filter(verse => verse.book === bookName);
};
