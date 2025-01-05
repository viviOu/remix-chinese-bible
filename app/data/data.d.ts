export interface BibleVerse {
  id: number;
  book: string;
  bookEng: string;
  chapter: string;
  section: string;
  content: string;
  isFavorite: boolean;
  isBookmark: boolean;
}

export type BibleArray = BibleVerse[];

export interface BookInfo {
  name: string;
  chapterNum: number;
}

export interface BooksList {
  [bookName: string]: string[];
}

export interface BookEntry {
  [key: string]: string[] | undefined; // Allow any string as a key
}

export interface BibleData {
  [bookName: string]: {
    [chapterKey: string]: {
      section: string;
      content: string;
    }[];
  };
}