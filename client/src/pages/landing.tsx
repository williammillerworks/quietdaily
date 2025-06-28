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
      <div className="min-h-screen bg-white flex flex-col max-w-[800px] mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <h1 className="text-xl font-normal text-gray-600">Quieted</h1>
          <Button
            onClick={handleGoogleLogin}
            variant="ghost"
            className="text-gray-900 hover:bg-gray-50 px-4"
          >
            Log in
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
              onClick={handleGoogleLogin}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Enter today's daily</span>
                <span className="text-gray-400">{formatDate(new Date())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[800px] mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center py-6">
        <h1 className="text-xl font-normal text-gray-600">Quieted</h1>
        <Button
          onClick={() => authService.logout()}
          variant="ghost"
          className="text-gray-900 hover:bg-gray-50 px-4"
        >
          Log out
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="space-y-4">
          {/* Today's memo entry */}
          <div className="border border-gray-200 rounded-lg">
            {todayMemo ? (
              <Link href="/memo/edit">
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-gray-900 font-medium">{todayMemo.title}</h3>
                    <span className="text-gray-500 text-sm">{formatDate(new Date())}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/memo/create">
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Enter today's daily</span>
                    <span className="text-gray-400">{formatDate(new Date())}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Previous memos */}
          {memos?.filter((memo: DailyMemo) => memo.date !== todayDateString).map((memo: DailyMemo) => (
            <div key={memo.id} className="border border-gray-200 rounded-lg">
              <Link href={`/memo/${memo.date}`}>
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-gray-900 font-medium">{memo.title}</h3>
                    <span className="text-gray-500 text-sm">
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