import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  title: string;
  text: string;
  className?: string;
}

export default function ShareButton({ title, text, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const url = window.location.href;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // User cancelled or error
      }
    } else {
      setMenuOpen(!menuOpen);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title}\n${text}\n${url}`)}`,
      "_blank"
    );
    setMenuOpen(false);
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} - ${text}`)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
    setMenuOpen(false);
  };

  // If native share is available, just use a simple button
  if (navigator.share) {
    return (
      <div className={className}>
        <Button
          onClick={handleNativeShare}
          variant="secondary"
          className="gap-2 rounded-xl font-medium text-sm">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="gap-2 rounded-xl font-medium text-sm">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={8} className="min-w-[180px] rounded-2xl">
          <DropdownMenuItem onClick={shareToWhatsApp} className="gap-3 px-4 py-3 rounded-xl cursor-pointer">
            <span className="text-lg">&#x1F4AC;</span>
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToTwitter} className="gap-3 px-4 py-3 rounded-xl cursor-pointer">
            <span className="text-lg">{"\uD835\uDD4F"}</span>
            Twitter / X
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyLink} className="gap-3 px-4 py-3 rounded-xl cursor-pointer">
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
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
