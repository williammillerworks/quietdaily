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
      <div className="min-h-screen flex flex-col items-center justify-center container">
        <div className="text-center max-w-md mx-auto animate-fade-in">
          <h1 
            className="text-gradient mb-6"
            style={{ fontSize: 'var(--text-4xl)', fontWeight: '700', lineHeight: '1.2' }}
          >
            Quieted
          </h1>
          <p 
            className="mb-8"
            style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--text-secondary)',
              lineHeight: '1.6'
            }}
          >
            Your personal space for daily reflections and thoughts.
          </p>
          <button 
            onClick={handleGoogleLogin}
            className="btn-primary inline-flex items-center"
            style={{ fontSize: 'var(--text-base)', padding: 'var(--space-4) var(--space-8)' }}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
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