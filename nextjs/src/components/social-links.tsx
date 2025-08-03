import React from "react";
import { FaInstagram } from "react-icons/fa";
import { INSTAGRAM_URL, BUSINESS_NAME } from "@/lib/constants";

export default function SocialLinks() {
  return (
    <div className="flex justify-center mt-6">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-retro-yellow hover:text-retro-yellow/80 transition-colors duration-200"
        aria-label={`Follow ${BUSINESS_NAME} on Instagram`}
      >
        <FaInstagram size={32} />
      </a>
    </div>
  );
}
