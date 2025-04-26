// src/app/(protected)/blog-management/_components/BlogPostDetail.tsx
"use client";

import React, { useState } from "react";
import { BlogPost } from "@/types/entities/blogPost";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";
import BlogPostForm from "./BlogPostForm";
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{blogPost.title}</h2>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div>Created: {formatDate(blogPost.createdAt || "")}</div>
            {blogPost.updatedAt && (
              <div>Updated: {formatDate(blogPost.updatedAt)}</div>
            )}
            <div>{renderStatusBadge(blogPost.status)}</div>
          </div>
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
          <Card>
            {blogPost.bannerImageUrl && (
              <div className="mb-4 h-64 w-full overflow-hidden rounded-t-lg">
                <img
                  src={blogPost.bannerImageUrl}
                  alt={blogPost.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <CardContent className="prose max-w-none pt-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: blogPost.content.replace(/\n/g, "<br />"),
                }}
              />
            </CardContent>
          </Card>

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
