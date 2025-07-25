import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import MemoForm from "@/pages/memo-form";
import MemoView from "@/pages/memo-view";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/memo/create">
        <MemoForm mode="create" />
      </Route>
      <Route path="/memo/edit">
        <MemoForm mode="edit" />
      </Route>
      <Route path="/memo/edit/:date">
        {(params) => <MemoForm mode="edit" memoDate={params.date} />}
      </Route>
      <Route path="/memo/view/:date">
        {(params) => <MemoView memoDate={params.date} />}
      </Route>
      <Route path="/memo/view">
        <MemoView />
      </Route>
      <Route path="/login-failed">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Login Failed</h1>
            <p className="text-gray-600">Authentication failed. Please try again.</p>
          </div>
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
