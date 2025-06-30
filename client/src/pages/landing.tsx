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
      <div className="min-h-screen container animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
        {/* Header */}
        <div className="flex justify-between items-start pt-8 pb-12">
          <h1 className="text-primary" style={{ fontSize: 'var(--text-xl)', fontWeight: '600' }}>
            Quieted
          </h1>
          <button
            onClick={handleGoogleLogin}
            className="btn-ghost"
          >
            Log in
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="space-y-4">
            {/* Create memo prompt card */}
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col container animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex justify-between items-start pt-8 pb-12">
        <h1 className="text-primary" style={{ fontSize: 'var(--text-xl)', fontWeight: '600' }}>
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
                        background: 'var(--gray-100)', 
                        color: 'var(--gray-700)' 
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

                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}