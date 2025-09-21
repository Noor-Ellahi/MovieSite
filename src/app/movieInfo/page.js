import { Suspense } from "react";
import MovieInfo from "@/app/movieInfo/movieInfo";

export default async function Page({ searchParams }) {
  // searchParams is provided by Next automatically

  const params = await searchParams;  // wait for the whole object
  const id = params.id;   
//   const id = await searchParams.id;

  return (
    <Suspense fallback={<div>Loading…</div>}>
      <MovieInfo id={id} />
    </Suspense>
  );
}