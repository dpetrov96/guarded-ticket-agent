import { useEffect, useState } from "react";

import { fetchChatConfigured } from "@/lib/chat-status";

export function useChatConfigured(): boolean | null {
  const [chatConfigured, setChatConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchChatConfigured()
      .then((configured) => {
        if (!cancelled) {
          setChatConfigured(configured);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setChatConfigured(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return chatConfigured;
}
