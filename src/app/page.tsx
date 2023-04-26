import { Inter } from 'next/font/google'
import Link from 'next/link';

async function fetchData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/get-csv-data`, { cache: 'no-store' });
  return res.json();
}

export default async function Home() {
  // const data = await fetchData();
  // console.log(`data[2]`, data[2]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="map">Map</Link>
      {/* <button className='btn btn-primary'>bootstrap</button> */}
      {/* <Button variant='outline-primary'>bootstrap</Button> */}
    </main>
  );
}
