// src/app/[locale]/(protected)/blog-management/_components/BlogPostDetail.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import "./style.scss";

interface BlogPostDetailProps {
  blogPost: BlogPost;
  onUpdate: (data: any) => Promise<{ data?: any; message?: string }>;
  onDelete: (id: string) => Promise<{ data?: any; message?: string }>;
  onPublish: (id: string) => Promise<{ data?: any; message?: string }>;
  onUnpublish: (id: string) => Promise<{ data?: any; message?: string }>;
  onApprove: (id: string) => Promise<{ data?: any; message?: string }>;
  onReject: (id: string) => Promise<{ data?: any; message?: string }>;
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
  const [isLoading, setIsLoading] = useState(false);
  const [operationType, setOperationType] = useState<string | null>(null);

  const t = useTranslations("blogManagement");
  const { success, error } = useToast();

  // Create placeholder values for missing fields from post-csr
  const author = {
    name: blogPost.createdByUserName || t("unknownAuthor"),
    avatar: "/placeholder-avatar.png", // Default avatar
  };

  const readingTime = useMemo(() => {
    const wpm = 150;
    return Math.ceil((blogPost.wordCount || 500) / wpm);
  }, [blogPost.wordCount]);

  const handleUpdate = async (data: any) => {
    try {
      setIsLoading(true);
      setOperationType("update");
      const result = await onUpdate({ id: blogPost.id, ...data });
      // if (result?.message) {
      //   success(result.message);
      // } else {
      //   success(t("updateSuccess"));
      // }
      setActiveTab("view");
    } catch (err: any) {
      error(err.message || t("updateError"));
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setOperationType("delete");
      const result = await onDelete(blogPost.id);
      if (result?.message) {
        success(result.message);
      } else {
        success(t("deleteSuccess"));
      }
    } catch (err: any) {
      error(err.message || t("deleteError"));
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      setOperationType("publish");
      const result = await onPublish(blogPost.id);
      if (result?.message) {
        success(result.message);
      } else {
        success(t("publishSuccess"));
      }
    } catch (err: any) {
      error(err.message || t("publishError"));
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  const handleUnpublish = async () => {
    try {
      setIsLoading(true);
      setOperationType("unpublish");
      const result = await onUnpublish(blogPost.id);
      if (result?.message) {
        success(result.message);
      } else {
        success(t("unpublishSuccess"));
      }
    } catch (err: any) {
      error(err.message || t("unpublishError"));
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      setOperationType("approve");
      const result = await onApprove(blogPost.id);
      if (result?.message) {
        success(result.message);
      } else {
        success(t("approveSuccess"));
      }
    } catch (err: any) {
      error(err.message || t("approveError"));
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      setOperationType("reject");
      const result = await onReject(blogPost.id);
      if (result?.message) {
        success(result.message);
      } else {
        success(t("rejectSuccess"));
      }
    } catch (err: any) {
      error(err.message || t("rejectError"));
    } finally {
      setIsLoading(false);
      setOperationType(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    let badgeClass = "";
    switch (status) {
      case "DRAFT":
        badgeClass =
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        break;
      case "PENDING_REVIEW":
        badgeClass =
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        break;
      case "APPROVED":
        badgeClass =
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
        break;
      case "PUBLISHED":
        badgeClass =
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        break;
      case "REJECTED":
        badgeClass =
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
        break;
      default:
        badgeClass =
          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }

    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold transition-colors ${badgeClass}`}
      >
        {t(`status.${status.toLowerCase().replace("_", "")}`)}
      </span>
    );
  };

  const renderActionButtons = () => (
    <div className="flex flex-wrap gap-2">
      {blogPost.status === "APPROVED" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handlePublish}
          disabled={isLoading && operationType === "publish"}
          className="flex items-center space-x-1 transition-colors text-xs sm:text-sm dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {isLoading && operationType === "publish" ? (
            <LoadingSpinner size="sm" />
          ) : (
            <ArrowUpCircle className="mr-1 h-4 w-4" />
          )}
          {t("actions.publish")}
        </Button>
      )}

      {blogPost.status === "PUBLISHED" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleUnpublish}
          disabled={isLoading && operationType === "unpublish"}
          className="flex items-center space-x-1 transition-colors text-xs sm:text-sm dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {isLoading && operationType === "unpublish" ? (
            <LoadingSpinner size="sm" />
          ) : (
            <ArrowDownCircle className="mr-1 h-4 w-4" />
          )}
          {t("actions.unpublish")}
        </Button>
      )}

      {blogPost.status === "PENDING_REVIEW" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleApprove}
            disabled={isLoading && operationType === "approve"}
            className="flex items-center text-green-600 dark:text-green-400 transition-colors text-xs sm:text-sm dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {isLoading && operationType === "approve" ? (
              <LoadingSpinner size="sm" />
            ) : (
              <CheckCircle className="mr-1 h-4 w-4" />
            )}
            {t("actions.approve")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={isLoading && operationType === "reject"}
            className="flex items-center text-red-600 dark:text-red-400 transition-colors text-xs sm:text-sm dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {isLoading && operationType === "reject" ? (
              <LoadingSpinner size="sm" />
            ) : (
              <XCircle className="mr-1 h-4 w-4" />
            )}
            {t("actions.reject")}
          </Button>
        </>
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="text-xs sm:text-sm transition-colors dark:bg-red-800 dark:hover:bg-red-700"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            {t("actions.delete")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="dark:bg-gray-800 dark:text-gray-100 transition-colors">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-300">
              {t("deleteConfirm.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading && operationType === "delete"}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700 transition-colors"
            >
              {isLoading && operationType === "delete" ? (
                <LoadingSpinner size="sm" />
              ) : (
                t("actions.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return (
    <div className="w-full dark:bg-gray-900 transition-colors">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <TabsList className="grid w-full sm:w-64 grid-cols-2 transition-colors dark:bg-gray-800">
            <TabsTrigger
              value="view"
              className="flex items-center transition-colors dark:data-[state=active]:bg-gray-700 dark:text-gray-200"
            >
              <Eye className="mr-2 h-4 w-4" />
              {t("tabs.view")}
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="flex items-center transition-colors dark:data-[state=active]:bg-gray-700 dark:text-gray-200"
            >
              <Pencil className="mr-2 h-4 w-4" />
              {t("tabs.edit")}
            </TabsTrigger>
          </TabsList>
          {renderActionButtons()}
        </div>

        <TabsContent value="edit">
          <BlogPostForm
            blogPost={blogPost}
            onSubmit={handleUpdate}
            isLoading={isLoading && operationType === "update"}
          />
        </TabsContent>

        <TabsContent value="view" className="w-full">
          <article className="py-4 sm:py-6 flex flex-col items-center w-full dark:text-gray-100 transition-colors">
            <PostReadingProgress />

            <PostHeader
              title={blogPost.title}
              author={blogPost.createdByUserName || t("unknownAuthor")}
              createdAt={blogPost.createdAt || ""}
              readingTime={readingTime}
              cover={blogPost.bannerImageUrl}
            />

            <div
              className="grid grid-cols-1 w-full px-2 sm:px-0 
             md:grid-cols-[1fr_minmax(650px,_1fr)_1fr] 
             lg:grid-cols-[minmax(auto,256px)_minmax(720px,1fr)_minmax(auto,256px)] 
             gap-4 md:gap-6 lg:gap-8"
            >
              {/* Left sidebar with sharing links */}
              <div className="hidden md:block">
                <PostSharing />
              </div>

              {/* Main content area */}
              <div>
                <PostContent>
                  <div className="dark:prose-invert prose-img:rounded prose-headings:scroll-mt-28">
                    <TiptapRenderer>{blogPost.content}</TiptapRenderer>
                  </div>
                </PostContent>
              </div>

              {/* Right sidebar */}
              <div className="hidden md:block">
                <PostToc />
              </div>
            </div>

            {/* Mobile sharing section shown only on small screens */}
            <div className="block md:hidden w-full mt-8">
              <PostSharing />
            </div>

            {/* Placeholder footer image */}
            <div className="mt-8 md:mt-10">
              <Image
                src="/doraemon.png"
                width={250}
                height={250}
                sizes="(max-width: 640px) 200px, (max-width: 768px) 225px, 250px"
                alt=""
                className="mx-auto transition-opacity hover:opacity-90"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </article>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostDetail;
