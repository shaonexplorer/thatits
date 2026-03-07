const canUseNavigator = typeof navigator !== "undefined";

export const resolveShareUrl = (path = "") => {
  if (typeof window === "undefined") {
    return path;
  }

  if (!path) {
    return window.location.href;
  }

  return new URL(path, window.location.origin).toString();
};

const fallbackCopyText = async (text) => {
  if (typeof document === "undefined") {
    return false;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
};

export const shareWithFallback = async ({ title, message, url }) => {
  const safeMessage = message ?? "";
  const shareUrl = resolveShareUrl(url);
  const textToShare = `${safeMessage}\n${shareUrl}`.trim();

  if (canUseNavigator && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title,
        text: safeMessage,
        url: shareUrl,
      });
      return { status: "shared" };
    } catch (error) {
      if (error?.name === "AbortError") {
        return { status: "cancelled" };
      }
    }
  }

  if (canUseNavigator && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(textToShare);
      return { status: "copied" };
    } catch {
      // Continue to execCommand fallback.
    }
  }

  const copied = await fallbackCopyText(textToShare);
  return { status: copied ? "copied" : "failed" };
};
