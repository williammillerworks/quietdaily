import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Shield, CheckCircle, LogOut, Info } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService, type AuthUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      setLocation("/");
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  if (!isLoading && !user) {
    setLocation("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(207,78%,45%)]"></div>
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-[hsl(207,78%,45%)] rounded-lg flex items-center justify-center">
                  <Shield className="text-white w-5 h-5" />
                </div>
                <span className="ml-3 text-xl font-medium text-[hsl(0,0%,13%)]">SecureAuth Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.picture || ""} alt={`${user.name} Avatar`} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-[hsl(0,0%,13%)] font-medium hidden sm:block">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-[hsl(0,0%,46%)] hover:text-[hsl(0,0%,13%)]"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 material-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="text-[hsl(142,71%,45%)] w-6 h-6 mr-3" />
              <h1 className="text-2xl font-light text-[hsl(0,0%,13%)]">
                Welcome back, {user.givenName || user.name.split(' ')[0]}!
              </h1>
            </div>
            <p className="text-[hsl(0,0%,46%)] mb-4">
              You've successfully authenticated with Google OAuth 2.0. Your session is secure and ready to use.
            </p>
            
            {/* User Info Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-[hsl(0,0%,46%)] mb-1">Email Address</div>
                <div className="font-medium text-[hsl(0,0%,13%)]">{user.email}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-[hsl(0,0%,46%)] mb-1">Authentication Method</div>
                <div className="font-medium text-[hsl(0,0%,13%)] flex items-center">
                  <SiGoogle className="w-4 h-4 mr-2" />
                  Google OAuth 2.0
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-[hsl(0,0%,46%)] mb-1">Last Sign In</div>
                <div className="font-medium text-[hsl(0,0%,13%)]">{formatDate(user.lastSignIn)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Guide */}
        <Card className="material-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-[hsl(0,0%,13%)]">
              <Info className="text-[hsl(207,78%,45%)] w-5 h-5 mr-2" />
              Integration Setup Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[hsl(0,0%,46%)] mb-6">
              Follow these steps to integrate Google OAuth 2.0 into your application:
            </p>
            
            {/* Setup Steps */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[hsl(207,78%,45%)] text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <h3 className="font-medium text-[hsl(0,0%,13%)]">Google Cloud Console Setup</h3>
                  <p className="text-[hsl(0,0%,46%)] text-sm">Create a new project in Google Cloud Console and enable the Google+ API.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[hsl(207,78%,45%)] text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <h3 className="font-medium text-[hsl(0,0%,13%)]">OAuth 2.0 Credentials</h3>
                  <p className="text-[hsl(0,0%,46%)] text-sm">Generate OAuth 2.0 client ID and client secret for your application.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[hsl(207,78%,45%)] text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <h3 className="font-medium text-[hsl(0,0%,13%)]">Environment Variables</h3>
                  <p className="text-[hsl(0,0%,46%)] text-sm">Set up GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-[hsl(207,78%,45%)] text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
                <div>
                  <h3 className="font-medium text-[hsl(0,0%,13%)]">Implement OAuth Flow</h3>
                  <p className="text-[hsl(0,0%,46%)] text-sm">Use Google's JavaScript SDK or server-side libraries to handle authentication.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="text-[hsl(207,78%,45%)] w-5 h-5 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-[hsl(0,0%,13%)] mb-1">Environment Setup Required</h4>
                  <p className="text-[hsl(0,0%,46%)] text-sm">
                    To use this application, you'll need to set up Google OAuth 2.0 credentials in your Google Cloud Console 
                    and configure the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
