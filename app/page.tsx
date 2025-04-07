'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin"); // Redirect if not authenticated
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4">Welcome {session?.user?.name}</h1>
      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Card 1: Stock Check */}
        <div className="flex justify-center">
          <Link
            href="/stock"
            className="flex flex-col items-center justify-center w-full h-full bg-gray-200 text-center shadow-lg rounded-lg hover:shadow-xl transition-all p-6 md:p-8"
          >
            <div className="text-lg md:text-2xl font-bold mb-4">Stock Check</div>
            <p className="text-gray-600 text-sm md:text-base">Check inventory and stock levels.</p>
          </Link>
        </div>

        {/* Placeholder Cards for Future Pages */}
        {/* {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="flex justify-center"
          >
            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-300 text-center rounded-lg p-8">
              <div className="text-2xl font-bold mb-4">&nbsp;</div>
              <p className="text-gray-500">&nbsp;</p>
            </div>
          </div>
        ))} */}

        {/* Uncomment and edit below for future cards */}
        {/* 
        <div className="flex justify-center">
          <Link
            href="/new-page"
            className="flex flex-col items-center justify-center w-full h-full bg-white text-center shadow-lg rounded-lg hover:shadow-xl transition-all p-6 md:p-8"
          >
            <div className="text-lg md:text-2xl font-bold mb-4">New Page</div>
            <p className="text-gray-600 text-sm md:text-base">Description of the new page.</p>
          </Link>
        </div>
        <div className="flex justify-center">
          <Link
            href="/another-page"
            className="flex flex-col items-center justify-center w-full h-full bg-white text-center shadow-lg rounded-lg hover:shadow-xl transition-all p-6 md:p-8"
          >
            <div className="text-lg md:text-2xl font-bold mb-4">Another Page</div>
            <p className="text-gray-600 text-sm md:text-base">Description for another page.</p>
          </Link>
        </div>
        */}
      </div>
    </div>
  );
};

export default Home;
