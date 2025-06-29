import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
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
    if (title.trim() && content.trim()) {
      saveMutation.mutate({
        title: title.trim(),
        link: link.trim() || undefined,
        content: content.trim(),
        date: targetDate,
      });
    }
  };

  const isFormValid = title.trim() && content.trim();

  return (
    <div className="min-h-screen bg-white max-w-[800px] mx-auto px-8 md:px-16">
      {/* Header with back button */}
      <div className="flex items-center pt-8 pb-12">
        <button
          onClick={() => setLocation("/")}
          className="text-gray-300 hover:text-gray-400 transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 flex justify-between items-center">
          <span className="text-lg font-light text-gray-300">Quieted</span>
          <span className="text-sm font-light text-gray-300">
            {formatDisplayDate(displayDate)}
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-8">
        {/* Title Input */}
        <div>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base font-light border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 focus-visible:ring-0 focus-visible:border-gray-300 placeholder:text-gray-300"
          />
        </div>

        {/* Link Input */}
        <div>
          <Input
            type="text"
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="text-base font-light border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 focus-visible:ring-0 focus-visible:border-gray-300 placeholder:text-gray-300"
          />
        </div>

        {/* Content Textarea */}
        <div className="flex-1">
          <Textarea
            placeholder="Contents"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] text-base font-light border-0 border-b border-gray-200 rounded-none bg-transparent px-0 py-3 resize-none focus-visible:ring-0 focus-visible:border-gray-300 placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-8 right-8 md:right-16">
        <button
          onClick={handleSave}
          disabled={!isFormValid || saveMutation.isPending}
          className={`px-6 py-2 text-sm font-light transition-colors ${
            isFormValid 
              ? "bg-gray-300 hover:bg-gray-400 text-white" 
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          {saveMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}