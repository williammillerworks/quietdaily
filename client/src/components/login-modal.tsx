import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setError(null);
    
    // Redirect to Google OAuth endpoint
    window.location.href = authService.getGoogleAuthUrl();
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-medium text-[hsl(0,0%,13%)]">
              Sign in to SecureAuth
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
              className="text-[hsl(0,0%,46%)] hover:text-[hsl(0,0%,13%)]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-center mb-6">
            <p className="text-[hsl(0,0%,46%)]">Choose your preferred sign-in method</p>
          </div>
          
          {/* Error State */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 w-4 h-4 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}
          
          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-[hsl(0,0%,13%)] font-medium py-3 material-shadow hover:material-shadow-hover transition-all mb-4"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[hsl(207,78%,45%)] mr-3"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center">
                <SiGoogle className="w-5 h-5 mr-3" />
                Continue with Google
              </div>
            )}
          </Button>
          
          <div className="text-center text-xs text-[hsl(0,0%,46%)]">
            By signing in, you agree to our{" "}
            <a href="#" className="text-[hsl(207,78%,45%)] hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="text-[hsl(207,78%,45%)] hover:underline">Privacy Policy</a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
