import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ACADEMY_SCHEDULE_UPDATES, useFollowedAcademies } from "@/context/FollowedAcademyContext";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import { mockNotifications } from "@/data/recommendations";

export interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
  [key: string]: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
const REMINDER_WINDOW_DAYS = 30;
const STORAGE_KEY = "khelgrid-notifications-v1";

function daysUntil(date: string) {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((eventDate.getTime() - today.getTime()) / 86400000);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [hydrated, setHydrated] = useState(false);
  const { savedOpportunities } = useSavedOpportunities();
  const { followedAcademies } = useFollowedAcademies();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNotifications(
            parsed.map((notification) => ({
              ...notification,
              createdAt: new Date(notification.createdAt),
            })) as Notification[],
          );
        }
      }
    } catch {
      // Notifications remain available for the current session.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [hydrated, notifications]);

  useEffect(() => {
    const approachingTrialNotifications = savedOpportunities
      .filter((trial) => {
        const days = daysUntil(trial.date);
        return days >= 0 && days <= REMINDER_WINDOW_DAYS;
      })
      .map((trial) => ({
        id: `saved-trial-${trial.id}`,
        type: "saved_trial_approaching",
        title: `Saved trial approaching: ${trial.title}`,
        description: `${trial.academy} · ${trial.date} · ${trial.city}. Review the organizer details before you travel or pay.`,
        read: false,
        createdAt: new Date(trial.date),
        trialId: trial.id,
      }));

    const academyNotifications = ACADEMY_SCHEDULE_UPDATES.filter((update) =>
      followedAcademies.includes(update.academy),
    ).map((update) => ({
      id: `academy-schedule-${update.academy}-${update.updatedAt}`,
      type: "followed_academy_schedule",
      title: `${update.academy} updated its schedule`,
      description: `${update.title}. ${update.description}`,
      read: false,
      createdAt: new Date(`${update.updatedAt}T00:00:00Z`),
      academy: update.academy,
    }));

    const generatedNotifications = [...approachingTrialNotifications, ...academyNotifications];
    if (generatedNotifications.length === 0) return;

    setNotifications((current) => {
      const existingIds = new Set(current.map((notification) => notification.id));
      const newNotifications = generatedNotifications.filter(
        (notification) => !existingIds.has(notification.id),
      );
      return newNotifications.length > 0 ? [...newNotifications, ...current] : current;
    });
  }, [followedAcademies, savedOpportunities]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const newNotification: Notification = { ...notification, id: `notif-${Date.now()}` };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  return (
    context ?? {
      notifications: [],
      unreadCount: 0,
      markAsRead: () => {},
      markAllAsRead: () => {},
      clearNotification: () => {},
      addNotification: () => {},
    }
  );
}
