import { FaInstagram } from "react-icons/fa";
import { SITE } from "@/lib/site";

export default function SocialLinks() {
  return (
    <div className="flex justify-center mt-6">
      <a
        href={SITE.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-retro-yellow hover:text-retro-yellow/80 transition-colors duration-200"
        aria-label={`Follow ${SITE.businessName} on Instagram`}
      >
        <FaInstagram size={32} />
      </a>
    </div>
  );
}
