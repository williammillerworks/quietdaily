import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
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
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: memos = [] } = useQuery<DailyMemo[]>({
    queryKey: ["/api/memos"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache data (React Query v5 uses gcTime instead of cacheTime)
  });

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      // Clear all user-related data
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.removeQueries({ queryKey: ["/api/memos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const todayDateString = getTodayDate();
  const todayMemo = memos?.find((memo: DailyMemo) => memo.date === todayDateString);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-[800px] mx-auto px-8 md:px-16">
        {/* Header */}
        <div className="flex justify-between items-start pt-[24px] pb-[24px]">
          <h1 className="text-lg text-gray-500 font-bold">Quieted</h1>
          <button
            onClick={handleGoogleLogin}
            className="text-sm text-gray-500 hover:text-gray-600 transition-colors font-medium"
          >
            Log in
          </button>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          {/* Input Area */}
          <div className="w-full">
            <Link href="/memo/create">
              <div className="pb-3 border-b border-gray-200 cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="font-light text-[15px] text-[#ababab]">Enter today's daily</span>
                  <span className="text-sm font-light text-[#a3a3a3]">{formatDate(new Date())}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col container animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex justify-between items-start pt-8 pb-12">
        <h1 className="text-gradient" style={{ fontSize: 'var(--text-xl)', fontWeight: '600' }}>
          Quieted
        </h1>
        <button
          onClick={handleLogout}
          className="btn-ghost"
        >
          Log out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="space-y-4">
          {/* Today's memo entry */}
          <div className="w-full">
            {todayMemo ? (
              <Link href="/memo/view">
                <div className="card p-6 animate-slide-up cursor-pointer">
                  <div className="flex justify-between items-start">
                    <h3 
                      className="font-medium"
                      style={{ 
                        fontSize: 'var(--text-base)', 
                        color: 'var(--text-primary)',
                        lineHeight: '1.5'
                      }}
                    >
                      {todayMemo.title}
                    </h3>
                    <span 
                      className="font-medium ml-4 flex-shrink-0"
                      style={{ 
                        fontSize: 'var(--text-sm)', 
                        color: 'var(--text-tertiary)' 
                      }}
                    >
                      {formatDate(new Date())}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div 
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                      style={{ 
                        background: 'var(--primary-light)', 
                        color: 'var(--primary)' 
                      }}
                    >
                      Today
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/memo/create">
                <div className="card p-6 animate-slide-up cursor-pointer border-dashed" style={{ borderColor: 'var(--gray-300)' }}>
                  <div className="flex justify-between items-center">
                    <span 
                      className="font-medium"
                      style={{ 
                        fontSize: 'var(--text-base)', 
                        color: 'var(--text-muted)' 
                      }}
                    >
                      Enter today's daily
                    </span>
                    <span 
                      className="font-medium"
                      style={{ 
                        fontSize: 'var(--text-sm)', 
                        color: 'var(--text-tertiary)' 
                      }}
                    >
                      {formatDate(new Date())}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center" style={{ color: 'var(--text-muted)' }}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span style={{ fontSize: 'var(--text-xs)' }}>Click to add your daily memo</span>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Previous memos */}
          {memos?.filter((memo: DailyMemo) => memo.date !== todayDateString).map((memo: DailyMemo, index) => (
            <div key={memo.id} className="w-full">
              <Link href={`/memo/view/${memo.date}`}>
                <div 
                  className="card p-6 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <h3 
                      className="font-medium"
                      style={{ 
                        fontSize: 'var(--text-base)', 
                        color: 'var(--text-primary)',
                        lineHeight: '1.5'
                      }}
                    >
                      {memo.title}
                    </h3>
                    <span 
                      className="font-medium ml-4 flex-shrink-0"
                      style={{ 
                        fontSize: 'var(--text-sm)', 
                        color: 'var(--text-tertiary)' 
                      }}
                    >
                      {formatDate(new Date(memo.date + 'T00:00:00'))}
                    </span>
                  </div>
                  {memo.link && (
                    <div className="mt-2">
                      <div 
                        className="inline-flex items-center text-xs"
                        style={{ color: 'var(--accent)' }}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Link attached
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}