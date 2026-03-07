import React, { useEffect, useState } from "react";
import { FiShare2 } from "react-icons/fi";
import { shareWithFallback } from "../../utils/share";

function ShareButton({
  title = "Taltula Luxury Clinic",
  message,
  url,
  label = "Share",
  className = "",
}) {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = setTimeout(() => setFeedback(""), 2200);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleShare = async () => {
    const result = await shareWithFallback({
      title,
      message,
      url,
    });

    if (result.status === "copied") {
      setFeedback("Copied");
      return;
    }

    if (result.status === "failed") {
      setFeedback("Unavailable");
      return;
    }

    setFeedback("");
  };

  return (
    <div className={`inline-flex flex-col items-end gap-1 ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-[#e4cbd7] bg-white/95 px-4 py-2 text-sm font-semibold text-[#7a2948] shadow-[0_6px_18px_rgba(99,36,63,0.1)] transition hover:bg-[#fff7fb]"
      >
        <FiShare2 className="text-base" />
        {label}
      </button>
      <span className="min-h-4 text-[11px] font-medium tracking-[0.06em] text-[#a65b75]">
        {feedback}
      </span>
    </div>
  );
}

export default ShareButton;
