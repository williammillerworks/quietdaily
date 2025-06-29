import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import type { DailyMemo } from "@shared/schema";

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function Landing() {
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: memos = [] } = useQuery<DailyMemo[]>({
    queryKey: ["/api/memos"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  const todayDateString = getTodayDate();
  const todayMemo = memos?.find((memo: DailyMemo) => memo.date === todayDateString);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-[800px] mx-auto px-8 md:px-16">
        {/* Header */}
        <div className="flex justify-between items-start pt-8 pb-12">
          <h1 className="text-lg font-light text-gray-500">Quieted</h1>
          <div className="flex items-center space-x-12">
            <span className="text-sm font-light text-gray-500 hidden md:block">{formatDate(new Date())}</span>
            <button
              onClick={handleGoogleLogin}
              className="text-sm font-light text-gray-500 hover:text-gray-600 transition-colors"
            >
              Log in
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile: Show date above input */}
          <div className="block md:hidden mb-8">
            <span className="text-sm font-light text-gray-500">{formatDate(new Date())}</span>
          </div>
          
          {/* Input Area */}
          <div className="w-full">
            <Link href="/memo/create">
              <div className="pb-3 border-b border-gray-200 cursor-pointer">
                <span className="text-base font-light text-gray-500">Enter today's daily</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[800px] mx-auto px-8 md:px-16">
      {/* Header */}
      <div className="flex justify-between items-start pt-8 pb-12">
        <h1 className="text-lg font-light text-gray-500">Quieted</h1>
        <div className="flex items-center space-x-12">
          <span className="text-sm font-light text-gray-500 hidden md:block">{formatDate(new Date())}</span>
          <button
            onClick={() => authService.logout()}
            className="text-sm font-light text-gray-500 hover:text-gray-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="space-y-8">
          {/* Mobile: Show date above content */}
          <div className="block md:hidden">
            <span className="text-sm font-light text-gray-500">{formatDate(new Date())}</span>
          </div>
          
          {/* Today's memo entry */}
          <div className="w-full">
            {todayMemo ? (
              <Link href="/memo/view">
                <div className="pb-3 border-b border-gray-200 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-light text-gray-600">{todayMemo.title}</h3>
                    <span className="text-sm font-light text-gray-500 hidden md:block">{formatDate(new Date())}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/memo/create">
                <div className="pb-3 border-b border-gray-200 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-light text-gray-500">Enter today's daily</span>
                    <span className="text-sm font-light text-gray-500 hidden md:block">{formatDate(new Date())}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Previous memos */}
          {memos?.filter((memo: DailyMemo) => memo.date !== todayDateString).map((memo: DailyMemo) => (
            <div key={memo.id} className="w-full">
              <Link href={`/memo/view/${memo.date}`}>
                <div className="pb-3 border-b border-gray-200 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-light text-gray-600">{memo.title}</h3>
                    <span className="text-sm font-light text-gray-500">
                      {formatDate(new Date(memo.date + 'T00:00:00'))}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}