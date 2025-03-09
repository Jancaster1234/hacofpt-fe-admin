// src/app/hackathon/[id]/_components/HackathonBanner.tsx

import Image from "next/image";

type HackathonBannerProps = {
  bannerImageUrl: string;
  altText: string;
};

// ISSUE: {lv5} This component uses h-auto, which can make UI weird if the image has high height and low width

export default function HackathonBanner({
  bannerImageUrl,
  altText,
}: HackathonBannerProps) {
  // Image should have width full of the parent div, h-auto/h set to a proportion, and shrink to fit the device width
  // This component use h-auto, which can make UI weird if the image has high height and low width
  // Solution 1: set a ratio for height and width for the parent div with aspect-[16/9] overflow-hidden. Solution 2: provide feature for organizer to crop the image with a predefined ratio
  return (
    <div className="relative w-full overflow-hidden">
      <Image
        src={bannerImageUrl}
        alt={altText}
        width={1920}
        height={1080}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
  );
}
