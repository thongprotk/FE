import { useState, useEffect, useRef } from "react";
import { analyticsService } from "@/services/analytics.service";
import { useAuth } from "@/contexts/AuthContext";

const POLL_INTERVAL_MS = 5 * 60 * 1000; // refresh mỗi 5 phút
export const CARDS_REVIEWED_EVENT = "cards-reviewed";

export function useDueCards() {
  const { isAuthenticated } = useAuth();
  const [dueCount, setDueCount] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setDueCount(0);
      return;
    }

    const fetchDue = async () => {
      try {
        const overview = await analyticsService.getOverview();
        setDueCount(overview.dueCards ?? 0);
      } catch {
        // silent — badge không hiện nếu lỗi
      }
    };

    fetchDue();
    timerRef.current = setInterval(fetchDue, POLL_INTERVAL_MS);

    // Refresh ngay khi user vừa review xong thẻ (không cần F5)
    window.addEventListener(CARDS_REVIEWED_EVENT, fetchDue);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener(CARDS_REVIEWED_EVENT, fetchDue);
    };
  }, [isAuthenticated]);

  return dueCount;
}
