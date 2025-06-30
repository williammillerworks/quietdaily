import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { DailyMemo } from "@shared/schema";

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

interface MemoViewProps {
  memoDate?: string;
}

export default function MemoView({ memoDate }: MemoViewProps) {
  const [, setLocation] = useLocation();
  
  const targetDate = memoDate || getTodayDate();
  const displayDate = new Date(targetDate + 'T00:00:00');

  // Fetch memo data
  const { data: memo, isLoading, error } = useQuery<DailyMemo>({
    queryKey: [`/api/memos/${targetDate}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  });



  if (isLoading) {
    return (
      <div className="min-h-screen bg-white max-w-[800px] mx-auto px-8 md:px-16">
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="min-h-screen bg-white max-w-[800px] mx-auto px-8 md:px-16">
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-gray-500">Memo not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
      {/* Header with back button */}
      <div className="flex items-center pt-8 pb-12">
        <button
          onClick={() => setLocation("/")}
          className="btn-ghost mr-2 p-2"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', color: 'var(--text-secondary)' }} />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <h1 className="text-primary" style={{ fontSize: 'var(--text-xl)', fontWeight: '600' }}>
            Quieted
          </h1>
          <div className="flex items-center space-x-4">
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: '500' }}>
              {formatDisplayDate(displayDate)}
            </span>
            <button
              onClick={() => setLocation(memoDate ? `/memo/edit/${memoDate}` : "/memo/edit")}
              className="btn-ghost"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="card p-8 animate-slide-up">
        {/* Title */}
        <div className="mb-8">
          <h1 
            style={{ 
              fontSize: 'var(--text-2xl)', 
              fontWeight: '600',
              color: 'var(--text-primary)',
              lineHeight: '1.4'
            }}
          >
            {memo.title}
          </h1>
        </div>

        {/* Link */}
        {memo.link && (
          <div className="mb-8">
            <div 
              className="inline-flex items-center p-4 rounded-lg"
              style={{ 
                background: 'var(--bg-secondary)',
                border: '1px solid var(--gray-200)'
              }}
            >
              <svg 
                className="w-5 h-5 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: 'var(--gray-500)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <a 
                href={memo.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ 
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-700)',
                  fontWeight: '500'
                }}
              >
                {memo.link}
              </a>
            </div>
          </div>
        )}

        {/* Content */}
        <div>
          <div 
            className="whitespace-pre-wrap"
            style={{ 
              fontSize: 'var(--text-base)', 
              color: 'var(--text-primary)',
              lineHeight: '1.7',
              fontWeight: '400'
            }}
          >
            {memo.content}
          </div>
        </div>
      </div>
    </div>
  );
}