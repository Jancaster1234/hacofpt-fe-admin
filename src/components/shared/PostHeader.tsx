// src/components/shared/PostHeader.tsx
import Image from "next/image";
import React from "react";
import { LuCalendarDays, LuClock } from "react-icons/lu";

interface PostHeaderProps {
  title: string;
  cover: string;
  author: string;
  createdAt: string;
  readingTime: number;
  avatarUrl?: string; // Added avatarUrl as optional prop
}

const PostHeader = ({
  title,
  author,
  cover,
  createdAt,
  readingTime,
  avatarUrl,
}: PostHeaderProps) => {
  return (
    <div className="lg:max-w-[45rem] mx-auto">
      <h1 className="text-3xl leading-snug md:text-4xl md:leading-normal font-bold">
        {title}
      </h1>

      <div className="flex items-center mt-6 gap-4">
        <Image
          src={
            avatarUrl ||
            "https://greenscapehub-media.s3.ap-southeast-1.amazonaws.com/hacofpt/504c1e5a-bc1f-4fe7-8905-d3bbbb12cabd_smiling-young-man-illustration_1308-174669.avif"
          } // Use avatarUrl if available, otherwise fall back to default
          width={50}
          height={50}
          alt={`${author}'s avatar`}
          className="rounded-full"
          onError={(e) => {
            // Fallback if avatar image fails to load
            (e.target as HTMLImageElement).src = "/avatar.jpg";
          }}
        />
        <div className="">
          <div className="font-semibold mb-3">
            By <u>{author}</u>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2 text-sm">
              <LuCalendarDays size={18} />
              <span>{createdAt}</span>
            </div>
            <div className="h-1.5 w-1.5 mx-3 rounded-full bg-gray-500 dark:bg-gray-300"></div>
            <div className="flex items-center gap-2 text-sm">
              <LuClock size={18} />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      <Image
        src={cover}
        alt={title}
        width={1932}
        height={1087}
        className="my-10 rounded-lg"
        priority
      />
    </div>
  );
};

export default PostHeader;
