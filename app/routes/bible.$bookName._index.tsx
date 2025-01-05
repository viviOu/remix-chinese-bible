import { redirect } from '@remix-run/node';
import { getBookChapters } from '../data/index';
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const { bookName } = params;

  // Check if the book exists
  const chapters = getBookChapters(bookName as string);
  if (chapters.length === 0) {
    throw new Response("Not Found!!!", { status: 404 });
  }

  // Redirect to the first chapter if no chapter is specified
  return redirect(`/bible/${encodeURIComponent(bookName as string)}/1`);
}

export default function BibleBookIndex() {
  return null;
}