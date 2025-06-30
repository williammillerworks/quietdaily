import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { authService } from "@/lib/auth";
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

interface MemoFormProps {
  mode: "create" | "edit";
  memoDate?: string;
}

export default function MemoForm({ mode, memoDate }: MemoFormProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");

  const targetDate = memoDate || getTodayDate();
  const displayDate = new Date(targetDate + 'T00:00:00');

  // Check if user is authenticated (optional for form access)
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch existing memo if editing
  const { data: existingMemo } = useQuery<DailyMemo>({
    queryKey: ["/api/memos", targetDate],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: mode === "edit",
  });

  useEffect(() => {
    if (existingMemo) {
      setTitle(existingMemo.title);
      setLink(existingMemo.link || "");
      setContent(existingMemo.content);
    }
  }, [existingMemo]);

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; link?: string; content: string; date: string }) => {
      return apiRequest("POST", "/api/memos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memos"] });
      setLocation("/");
    },
  });

  const handleSave = () => {
    if (title?.trim() && content?.trim()) {
      if (!user) {
        // If user is not authenticated, redirect to Google auth
        window.location.href = authService.getGoogleAuthUrl();
      } else {
        // User is authenticated, save the memo
        saveMutation.mutate({
          title: title.trim(),
          link: link?.trim() || undefined,
          content: content.trim(),
          date: targetDate,
        });
      }
    }
  };

  const isFormValid = title?.trim() && content?.trim();

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
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: '500' }}>
            {formatDisplayDate(displayDate)}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="card p-8 animate-slide-up">
        <div className="space-y-8">
          {/* Title Input */}
          <div>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 border-b rounded-none bg-transparent px-0 py-4 focus-visible:ring-0 placeholder:text-muted-foreground"
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: '500',
                borderBottomColor: 'var(--gray-200)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Link Input */}
          <div>
            <Input
              type="text"
              placeholder="Link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border-0 border-b rounded-none bg-transparent px-0 py-4 focus-visible:ring-0 placeholder:text-muted-foreground"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: '400',
                borderBottomColor: 'var(--gray-200)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Content Textarea */}
          <div className="flex-1">
            <Textarea
              placeholder="Write your daily memo..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] border-0 border-b rounded-none bg-transparent px-0 py-4 resize-none focus-visible:ring-0 placeholder:text-muted-foreground"
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: '400',
                lineHeight: '1.7',
                borderBottomColor: 'var(--gray-200)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-8 right-8 md:right-16">
        <button
          onClick={handleSave}
          disabled={!isFormValid || saveMutation.isPending}
          className={`btn-primary ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ 
            padding: 'var(--space-3) var(--space-6)',
            fontSize: 'var(--text-sm)',
            fontWeight: '500'
          }}
        >
          {saveMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}