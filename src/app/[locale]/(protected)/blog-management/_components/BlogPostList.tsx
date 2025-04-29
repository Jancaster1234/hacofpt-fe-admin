// src/app/[locale]/(protected)/blog-management/_components/BlogPostList.tsx
"use client";

import React from "react";
import { BlogPost } from "@/types/entities/blogPost";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Trash2,
  Edit,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface BlogPostListProps {
  blogPosts: BlogPost[];
  onViewPost: (id: string) => void;
  onDeletePost: (id: string) => void;
  onPublishPost: (id: string) => void;
  onUnpublishPost: (id: string) => void;
  onApprovePost: (id: string) => void;
  onRejectPost: (id: string) => void;
  isProcessing?: boolean;
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  blogPosts,
  onViewPost,
  onDeletePost,
  onPublishPost,
  onUnpublishPost,
  onApprovePost,
  onRejectPost,
  isProcessing = false,
}) => {
  const t = useTranslations("blogPostList");

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      case "PENDING_REVIEW":
        return "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-800 dark:text-yellow-300";
      case "APPROVED":
        return "bg-blue-100 dark:bg-blue-700/30 text-blue-800 dark:text-blue-300";
      case "PUBLISHED":
        return "bg-green-100 dark:bg-green-700/30 text-green-800 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 dark:bg-red-700/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const renderStatusBadge = (post: BlogPost) => {
    // The correct way to transform the status key for translation lookup
    const statusKey = post.status
      .toLowerCase()
      .replace(/_/g, "") as keyof typeof t.status;

    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold transition-colors duration-200 ${getStatusBadgeClass(
          post.status
        )}`}
      >
        {t(`status.${statusKey}`) || post.status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      {blogPosts.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {t("noPosts")}
        </div>
      ) : (
        <div className="rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                <TableHead className="w-1/3 sm:w-auto">
                  {t("headers.title")}
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("headers.status")}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("headers.created")}
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  {t("headers.updated")}
                </TableHead>
                <TableHead className="text-right">
                  {t("headers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-gray-900 dark:text-gray-100">
                        {post.title}
                      </span>
                      <span className="block sm:hidden">
                        {renderStatusBadge(post)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {renderStatusBadge(post)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-600 dark:text-gray-400">
                    {post.createdAt ? formatDate(post.createdAt) : "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-600 dark:text-gray-400">
                    {post.updatedAt ? formatDate(post.updatedAt) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1 sm:space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewPost(post.id)}
                        title={t("actions.view")}
                        disabled={isProcessing}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeletePost(post.id)}
                        title={t("actions.delete")}
                        disabled={isProcessing}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      >
                        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </Button>

                      {/* Conditional action buttons based on post status */}
                      {post.status === "APPROVED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPublishPost(post.id)}
                          title={t("actions.publish")}
                          disabled={isProcessing}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          {isProcessing ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                        </Button>
                      )}

                      {post.status === "PUBLISHED" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onUnpublishPost(post.id)}
                          title={t("actions.unpublish")}
                          disabled={isProcessing}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          {isProcessing ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          )}
                        </Button>
                      )}

                      {post.status === "PENDING_REVIEW" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onApprovePost(post.id)}
                            title={t("actions.approve")}
                            disabled={isProcessing}
                            className="h-8 w-8 sm:h-9 sm:w-9"
                          >
                            {isProcessing ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRejectPost(post.id)}
                            title={t("actions.reject")}
                            disabled={isProcessing}
                            className="h-8 w-8 sm:h-9 sm:w-9"
                          >
                            {isProcessing ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BlogPostList;
