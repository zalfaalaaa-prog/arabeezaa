"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { refreshDailyHearts } from "@/app/actions";

function millisecondsUntilJakartaMidnight() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).formatToParts(new Date());
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value || 0);
  const year = value("year");
  const month = value("month");
  const day = value("day");

  // 00.00 WIB is 17.00 UTC on the previous calendar day.
  const nextMidnightUtc = Date.UTC(year, month - 1, day, 17, 0, 0, 0);
  return Math.max(1_000, nextMidnightUtc - Date.now() + 500);
}

export default function DailyHeartSync() {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let syncing = false;
    let disposed = false;

    const sync = async () => {
      if (syncing || disposed) return;
      syncing = true;
      try {
        const result = await refreshDailyHearts();
        if (!disposed && result.ok && result.reset) router.refresh();
      } catch {
        // The next page request or answer check will retry the daily reset.
      } finally {
        syncing = false;
      }
    };

    const scheduleNextMidnight = () => {
      timer = setTimeout(async () => {
        await sync();
        if (!disposed) scheduleNextMidnight();
      }, millisecondsUntilJakartaMidnight());
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") void sync();
    };

    scheduleNextMidnight();
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [router]);

  return null;
}
