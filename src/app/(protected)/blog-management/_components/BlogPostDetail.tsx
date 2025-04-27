// src/app/(protected)/blog-management/_components/BlogPostDetail.tsx
"use client";

import React, { useState, useMemo } from "react";
import { BlogPost } from "@/types/entities/blogPost";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/dateFormatter";
import BlogPostForm from "./BlogPostForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Pencil,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Share2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TiptapRenderer from "@/components/TiptapRenderer/ClientRenderer";
import PostHeader from "@/components/shared/PostHeader";
import PostToc from "@/components/shared/PostToc";
import PostContent from "@/components/shared/PostContent";
import PostSharing from "@/components/shared/PostSharing";
import PostReadingProgress from "@/components/shared/PostReadingProgress";
import Image from "next/image";

interface BlogPostDetailProps {
  blogPost: BlogPost;
  onUpdate: (data: any) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  blogPost,
  onUpdate,
  onDelete,
  onPublish,
  onUnpublish,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState("view");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Create placeholder values for missing fields from post-csr
  const author = {
    name: blogPost.createdByUserName || "Unknown Author",
    avatar: "/placeholder-avatar.png", // Default avatar
  };

  const readingTime = useMemo(() => {
    const wpm = 150;
    return Math.ceil((blogPost.wordCount || 500) / wpm);
  }, [blogPost.wordCount]);

  const handleUpdate = (data: any) => {
    onUpdate({ id: blogPost.id, ...data });
    setActiveTab("view");
  };

  const renderStatusBadge = (status: string) => {
    let badgeClass = "";
    switch (status) {
      case "DRAFT":
        badgeClass = "bg-gray-100 text-gray-800";
        break;
      case "PENDING_REVIEW":
        badgeClass = "bg-yellow-100 text-yellow-800";
        break;
      case "APPROVED":
        badgeClass = "bg-blue-100 text-blue-800";
        break;
      case "PUBLISHED":
        badgeClass = "bg-green-100 text-green-800";
        break;
      case "REJECTED":
        badgeClass = "bg-red-100 text-red-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
    }

    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${badgeClass}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const renderActionButtons = () => (
    <div className="flex space-x-2">
      {blogPost.status === "APPROVED" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPublish(blogPost.id)}
          className="flex items-center space-x-1"
        >
          <ArrowUpCircle className="mr-1 h-4 w-4" />
          Publish
        </Button>
      )}

      {blogPost.status === "PUBLISHED" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUnpublish(blogPost.id)}
          className="flex items-center space-x-1"
        >
          <ArrowDownCircle className="mr-1 h-4 w-4" />
          Unpublish
        </Button>
      )}

      {blogPost.status === "PENDING_REVIEW" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onApprove(blogPost.id)}
            className="flex items-center text-green-600"
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject(blogPost.id)}
            className="flex items-center text-red-600"
          >
            <XCircle className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </>
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(blogPost.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-64 grid-cols-2">
            <TabsTrigger value="view" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              View
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </TabsTrigger>
          </TabsList>
          {renderActionButtons()}
        </div>

        <TabsContent value="edit">
          <BlogPostForm blogPost={blogPost} onSubmit={handleUpdate} />
        </TabsContent>

        <TabsContent value="view" className="w-full">
          <article className="py-6 flex flex-col items-center w-full">
            <PostReadingProgress />

            {/* <div className="w-full max-w-3xl mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">{blogPost.title}</h1>
              <div>{renderStatusBadge(blogPost.status)}</div>
            </div> */}

            <PostHeader
              title={blogPost.title}
              author={blogPost.createdByUserName || "Unknown Author"}
              createdAt={blogPost.createdAt || ""}
              readingTime={readingTime}
              cover={blogPost.bannerImageUrl}
            />

            <div className="grid grid-cols-1 w-full lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] gap-6 lg:gap-8">
              {/* Left sidebar with sharing links */}
              <PostSharing />

              {/* Main content area */}
              <PostContent>
                {blogPost.content.startsWith("{") ? (
                  <TiptapRenderer>{blogPost.content}</TiptapRenderer>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blogPost.content.replace(/\n/g, "<br />"),
                    }}
                  />
                )}
              </PostContent>

              {/* Right sidebar - use PostToc directly */}
              <PostToc />
            </div>

            {/* Placeholder footer image */}
            <Image
              src="/doraemon.png"
              width={350}
              height={350}
              alt=""
              className="mx-auto mt-10"
              onError={(e) => {
                // Fallback if image doesn't exist
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </article>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostDetail;
