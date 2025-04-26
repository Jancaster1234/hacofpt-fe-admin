// src/app/(protected)/blog-management/_components/BlogPostList.tsx
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

interface BlogPostListProps {
  blogPosts: BlogPost[];
  onViewPost: (id: string) => void;
  onDeletePost: (id: string) => void;
  onPublishPost: (id: string) => void;
  onUnpublishPost: (id: string) => void;
  onApprovePost: (id: string) => void;
  onRejectPost: (id: string) => void;
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  blogPosts,
  onViewPost,
  onDeletePost,
  onPublishPost,
  onUnpublishPost,
  onApprovePost,
  onRejectPost,
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStatusBadge = (post: BlogPost) => {
    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
          post.status
        )}`}
      >
        {post.status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div>
      {blogPosts.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No blog posts found. Create your first blog post!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{renderStatusBadge(post)}</TableCell>
                <TableCell>
                  {post.createdAt ? formatDate(post.createdAt) : "-"}
                </TableCell>
                <TableCell>
                  {post.updatedAt ? formatDate(post.updatedAt) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewPost(post.id)}
                      title="View/Edit"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeletePost(post.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>

                    {/* Conditional action buttons based on post status */}
                    {post.status === "APPROVED" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPublishPost(post.id)}
                        title="Publish"
                      >
                        <ArrowUpCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}

                    {post.status === "PUBLISHED" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUnpublishPost(post.id)}
                        title="Unpublish"
                      >
                        <ArrowDownCircle className="h-4 w-4 text-yellow-600" />
                      </Button>
                    )}

                    {post.status === "PENDING_REVIEW" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApprovePost(post.id)}
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRejectPost(post.id)}
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BlogPostList;
