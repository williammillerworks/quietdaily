import { users, sessions, dailyMemos, type User, type InsertUser, type Session, type DailyMemo, type InsertDailyMemo } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  updateLastSignIn(id: number): Promise<void>;
  createSession(userId: number, sessionId: string, expiresAt: Date): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  deleteUserSessions(userId: number): Promise<void>;
  
  // Daily memo operations
  getUserMemos(userId: number): Promise<DailyMemo[]>;
  getMemoByDate(userId: number, date: string): Promise<DailyMemo | undefined>;
  createMemo(memo: InsertDailyMemo): Promise<DailyMemo>;
  updateMemo(id: number, updates: Partial<InsertDailyMemo>): Promise<DailyMemo | undefined>;
  deleteMemo(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateLastSignIn(id: number): Promise<void> {
    await db
      .update(users)
      .set({ lastSignIn: new Date() })
      .where(eq(users.id, id));
  }

  async createSession(userId: number, sessionId: string, expiresAt: Date): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId,
        expiresAt,
      })
      .returning();
    return session;
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId));
      
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    if (session) {
      await this.deleteSession(sessionId);
    }
    return undefined;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async deleteUserSessions(userId: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }

  // Daily memo operations
  async getUserMemos(userId: number): Promise<DailyMemo[]> {
    const memos = await db
      .select()
      .from(dailyMemos)
      .where(eq(dailyMemos.userId, userId))
      .orderBy(desc(dailyMemos.date));
    return memos;
  }

  async getMemoByDate(userId: number, date: string): Promise<DailyMemo | undefined> {
    const [memo] = await db
      .select()
      .from(dailyMemos)
      .where(and(eq(dailyMemos.userId, userId), eq(dailyMemos.date, date)));
    return memo || undefined;
  }

  async createMemo(memo: InsertDailyMemo): Promise<DailyMemo> {
    const [newMemo] = await db
      .insert(dailyMemos)
      .values(memo)
      .returning();
    return newMemo;
  }

  async updateMemo(id: number, updates: Partial<InsertDailyMemo>): Promise<DailyMemo | undefined> {
    const [memo] = await db
      .update(dailyMemos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(dailyMemos.id, id))
      .returning();
    return memo || undefined;
  }

  async deleteMemo(id: number): Promise<void> {
    await db.delete(dailyMemos).where(eq(dailyMemos.id, id));
  }
}

export const storage = new DatabaseStorage();
