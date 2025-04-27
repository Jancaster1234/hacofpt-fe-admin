// src/app/(protected)/blog-management/_components/BlogPostDetail.tsx
"use client";

import React, { useState, useMemo } from "react";
import { BlogPost } from "@/types/entities/blogPost";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Clock,
  User,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import BlogPostForm from "./BlogPostForm";
import TiptapRenderer from "@/components/TiptapRenderer/ClientRenderer";
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

// New components based on post-csr/page.tsx
const PostReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / docHeight) * 100;
      setProgress(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full bg-primary transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const PostHeader: React.FC<{
  title: string;
  author?: string;
  createdAt?: string;
  readingTime: number;
  bannerImageUrl?: string;
}> = ({ title, author, createdAt, readingTime, bannerImageUrl }) => {
  return (
    <header className="w-full max-w-4xl mb-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
        {author && (
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{author}</span>
          </div>
        )}
        {createdAt && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(createdAt)}</span>
          </div>
        )}
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{readingTime} min read</span>
        </div>
      </div>
      {bannerImageUrl && (
        <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8">
          <img
            src={bannerImageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </header>
  );
};

const PostToc: React.FC = () => {
  // Placeholder for table of contents
  // In a real implementation, you would extract headings from the content
  return (
    <aside className="hidden lg:block sticky top-24 self-start">
      <div className="p-4 border rounded-lg">
        <h3 className="font-semibold mb-2">Table of Contents</h3>
        <ul className="space-y-2 text-sm">
          <li className="text-gray-600 hover:text-primary transition-colors">
            Introduction
          </li>
          <li className="text-gray-600 hover:text-primary transition-colors">
            Main Content
          </li>
          <li className="text-gray-600 hover:text-primary transition-colors">
            Conclusion
          </li>
        </ul>
      </div>
    </aside>
  );
};

const PostSharing: React.FC<{ title?: string }> = ({ title }) => {
  return (
    <aside className="hidden lg:flex sticky top-24 self-start flex-col items-center space-y-4">
      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
        <Share2 className="h-5 w-5" />
      </button>
      <div className="text-xs text-gray-500">Share</div>
    </aside>
  );
};

const PostContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="prose prose-lg max-w-none">{children}</div>;
};

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

  // Calculate reading time
  const readingTime = useMemo(() => {
    const wpm = 150;
    return Math.ceil((blogPost.wordCount || 0) / wpm) || 3; // Default to 3 minutes if wordCount is missing
  }, [blogPost.wordCount]);

  // Get author name from createdByUserName or placeholder
  const authorName = blogPost.createdByUserName || "Unknown Author";

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

  return (
    <div>
      {/* Admin Controls - Visible in both tabs */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {renderStatusBadge(blogPost.status)}
        </div>

        <div className="flex space-x-2">
          {/* Status-specific action buttons */}
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

          <AlertDialog
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
          >
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="view" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            View
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          {/* Reading Progress Bar */}
          <PostReadingProgress />

          <article className="py-6 px-4 flex flex-col items-center">
            {/* Post Header with metadata */}
            <PostHeader
              title={blogPost.title}
              author={authorName}
              createdAt={blogPost.createdAt}
              readingTime={readingTime}
              bannerImageUrl={blogPost.bannerImageUrl}
            />

            <div className="grid grid-cols-1 w-full lg:w-auto lg:grid-cols-[minmax(auto,64px)_minmax(720px,1fr)_minmax(auto,224px)] gap-6 lg:gap-8">
              {/* Sharing sidebar */}
              <PostSharing title={blogPost.title} />

              {/* Main content */}
              <PostContent>
                <TiptapRenderer>{blogPost.content}</TiptapRenderer>
              </PostContent>

              {/* Table of contents */}
              <PostToc />
            </div>
          </article>

          {blogPost.reviewedById && (
            <div className="mt-4 rounded-md bg-blue-50 p-4 text-blue-800">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <p className="text-sm">
                  This post was reviewed by {blogPost.reviewedBy?.firstName}{" "}
                  {blogPost.reviewedBy?.lastName}
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="edit">
          <BlogPostForm blogPost={blogPost} onSubmit={handleUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostDetail;
