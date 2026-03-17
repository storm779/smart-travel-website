import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  className?: string;
}

export default function ShareButton({ title, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const url = window.location.href;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled or error
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${text}\n${url}`)}`,
      "_blank"
    );
    setShowMenu(false);
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} - ${text}`)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
    setShowMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition font-medium text-sm">
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {showMenu && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[180px] z-50 animate-fade-in">
          <button
            onClick={shareToWhatsApp}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition text-sm text-gray-700">
            <span className="text-lg">💬</span>
            WhatsApp
          </button>
          <button
            onClick={shareToTwitter}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition text-sm text-gray-700">
            <span className="text-lg">𝕏</span>
            Twitter / X
          </button>
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition text-sm text-gray-700">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
