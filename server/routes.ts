import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";
import { insertUserSchema, insertDailyMemoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  }));

  // Passport configuration
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    callbackURL: process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
      : "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await storage.getUserByGoogleId(profile.id);
      
      if (user) {
        // Update existing user
        await storage.updateUser(user.id, {
          name: profile.displayName || user.name,
          givenName: profile.name?.givenName || user.givenName,
          picture: profile.photos?.[0]?.value || user.picture,
          accessToken,
          refreshToken,
        });
        await storage.updateLastSignIn(user.id);
        user = await storage.getUser(user.id);
      } else {
        // Create new user
        const newUser = {
          googleId: profile.id,
          email: profile.emails?.[0]?.value || "",
          name: profile.displayName || "",
          givenName: profile.name?.givenName,
          picture: profile.photos?.[0]?.value,
          accessToken,
          refreshToken,
        };
        
        user = await storage.createUser(newUser);
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Auth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login-failed" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Protected route middleware
  function requireAuth(req: any, res: any, next: any) {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ message: "Authentication required" });
    }
  }

  // Example protected route
  app.get("/api/profile", requireAuth, (req, res) => {
    res.json(req.user);
  });

  // Daily memo routes
  app.get("/api/memos", requireAuth, async (req: any, res) => {
    try {
      const memos = await storage.getUserMemos(req.user.id);
      console.log('API returning memos count:', memos.length);
      console.log('First memo:', memos[0]);
      res.setHeader('Cache-Control', 'no-cache');
      res.json(memos);
    } catch (error) {
      console.error("Error fetching memos:", error);
      res.status(500).json({ message: "Failed to fetch memos" });
    }
  });

  app.get("/api/memos/:date", requireAuth, async (req: any, res) => {
    try {
      const { date } = req.params;
      console.log('Fetching memo for date:', date, 'userId:', req.user.id);
      const memo = await storage.getMemoByDate(req.user.id, date);
      console.log('Found memo:', memo ? `id:${memo.id} title:${memo.title}` : 'null');
      if (!memo) {
        return res.status(404).json({ message: "Memo not found" });
      }
      res.json(memo);
    } catch (error) {
      console.error("Error fetching memo:", error);
      res.status(500).json({ message: "Failed to fetch memo" });
    }
  });

  app.post("/api/memos", requireAuth, async (req: any, res) => {
    try {
      const memoData = insertDailyMemoSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      // Check if memo already exists for this date
      const existingMemo = await storage.getMemoByDate(req.user.id, memoData.date);
      if (existingMemo) {
        // Update existing memo
        const updatedMemo = await storage.updateMemo(existingMemo.id, {
          title: memoData.title,
          link: memoData.link,
          content: memoData.content,
        });
        return res.json(updatedMemo);
      }

      // Create new memo
      const memo = await storage.createMemo(memoData);
      res.status(201).json(memo);
    } catch (error) {
      console.error("Error creating/updating memo:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid memo data" });
      }
      res.status(500).json({ message: "Failed to save memo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
