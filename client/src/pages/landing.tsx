import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { SiGoogle } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/login-modal";
import { authService } from "@/lib/auth";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
  });

  // Redirect if already authenticated
  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header with only Google sign in button */}
        <header className="w-full">
          <div className="flex justify-end px-6 py-4">
            <Button 
              onClick={() => setIsLoginModalOpen(true)}
              variant="outline"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2 rounded-md transition-all flex items-center gap-3 shadow-sm"
            >
              <SiGoogle className="w-5 h-5" />
              Sign in with Google
            </Button>
          </div>
        </header>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}
