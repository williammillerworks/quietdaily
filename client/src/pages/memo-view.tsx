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
  const { data: memo, isLoading } = useQuery<DailyMemo>({
    queryKey: ["/api/memos", targetDate],
    queryFn: getQueryFn({ on401: "returnNull" }),
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
    <div className="min-h-screen bg-white max-w-[800px] mx-auto px-8 md:px-16">
      {/* Header with back button */}
      <div className="flex items-center pt-8 pb-12">
        <button
          onClick={() => setLocation("/")}
          className="text-gray-500 hover:text-gray-600 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <span className="text-lg font-light text-gray-500">Quieted</span>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-light text-gray-500">
              {formatDisplayDate(displayDate)}
            </span>
            <button
              onClick={() => setLocation(memoDate ? `/memo/edit/${memoDate}` : "/memo/edit")}
              className="text-sm font-light text-gray-500 hover:text-gray-600 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-xl font-light text-gray-700 pb-3 border-b border-gray-200">
            {memo.title}
          </h1>
        </div>

        {/* Link */}
        {memo.link && (
          <div>
            <a 
              href={memo.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-base font-light text-blue-500 hover:text-blue-600 transition-colors pb-3 border-b border-gray-200 block"
            >
              {memo.link}
            </a>
          </div>
        )}

        {/* Content */}
        <div>
          <div className="text-base font-light text-gray-700 whitespace-pre-wrap leading-relaxed">
            {memo.content}
          </div>
        </div>
      </div>
    </div>
  );
}