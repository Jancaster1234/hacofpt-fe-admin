// src/app/[locale]/(protected)/blog-management/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { blogPostService } from "@/services/blogPost.service";
import { BlogPost, BlogPostStatus } from "@/types/entities/blogPost";
import BlogPostList from "./_components/BlogPostList";
import BlogPostForm from "./_components/BlogPostForm";
import BlogPostDetail from "./_components/BlogPostDetail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTranslations } from "@/hooks/useTranslations";

export default function BlogManagement() {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentView, setCurrentView] = useState<"list" | "create" | "detail">(
    "list"
  );
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const toast = useToast();
  const t = useTranslations("blogManagement");

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const response = await blogPostService.getAllBlogPosts();
      setBlogPosts(response.data);
      // Don't show toast for initial data loading
    } catch (err: any) {
      setError(err.message || t("errors.fetchFailed"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlogPost = async (data: {
    title: string;
    content: string;
    bannerImageUrl: string;
    slug?: string;
    status?: BlogPostStatus;
  }) => {
    setIsProcessing(true);
    try {
      // Calculate word count from HTML content
      const wordCount = calculateWordCount(data.content);

      const response = await blogPostService.createBlogPost({
        ...data,
        wordCount,
      });

      toast.success(response.message || t("success.postCreated"));
      fetchBlogPosts();
      setCurrentView("list");
    } catch (err: any) {
      console.error("Error creating blog post:", err);
      toast.error(err.message || t("errors.createFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateBlogPost = async (data: {
    id: string;
    title?: string;
    content?: string;
    wordCount?: number;
    bannerImageUrl?: string;
    slug?: string;
    status?: BlogPostStatus;
  }) => {
    setIsProcessing(true);
    try {
      // Calculate word count if content is updated
      const updatedData = { ...data };
      if (data.content) {
        updatedData.wordCount = calculateWordCount(data.content);
      }

      const response = await blogPostService.updateBlogPost(updatedData);
      toast.success(response.message || t("success.postUpdated"));

      if (selectedPost) {
        const detailResponse = await blogPostService.getBlogPostById(data.id);
        setSelectedPost(detailResponse.data);
      }
      fetchBlogPosts();
    } catch (err: any) {
      console.error("Error updating blog post:", err);
      toast.error(err.message || t("errors.updateFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to calculate word count from HTML content
  const calculateWordCount = (htmlContent: string): number => {
    // Remove HTML tags and count words
    const text = htmlContent.replace(/<[^>]*>/g, " ");
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    return words.length;
  };

  const handleDeleteBlogPost = async (id: string) => {
    setIsProcessing(true);
    try {
      const response = await blogPostService.deleteBlogPost(id);
      toast.success(response.message || t("success.postDeleted"));
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
        setCurrentView("list");
      }
    } catch (err: any) {
      console.error("Error deleting blog post:", err);
      toast.error(err.message || t("errors.deleteFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishBlogPost = async (id: string) => {
    setIsProcessing(true);
    try {
      const response = await blogPostService.publishBlogPost(id);
      toast.success(response.message || t("success.postPublished"));
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        const detailResponse = await blogPostService.getBlogPostById(id);
        setSelectedPost(detailResponse.data);
      }
    } catch (err: any) {
      console.error("Error publishing blog post:", err);
      toast.error(err.message || t("errors.publishFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnpublishBlogPost = async (id: string) => {
    setIsProcessing(true);
    try {
      const response = await blogPostService.unpublishBlogPost(id);
      toast.success(response.message || t("success.postUnpublished"));
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        const detailResponse = await blogPostService.getBlogPostById(id);
        setSelectedPost(detailResponse.data);
      }
    } catch (err: any) {
      console.error("Error unpublishing blog post:", err);
      toast.error(err.message || t("errors.unpublishFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveBlogPost = async (id: string) => {
    if (!user?.id) return;
    setIsProcessing(true);
    try {
      const response = await blogPostService.approveBlogPost(id, user.id);
      toast.success(response.message || t("success.postApproved"));
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        const detailResponse = await blogPostService.getBlogPostById(id);
        setSelectedPost(detailResponse.data);
      }
    } catch (err: any) {
      console.error("Error approving blog post:", err);
      toast.error(err.message || t("errors.approveFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectBlogPost = async (id: string) => {
    if (!user?.id) return;
    setIsProcessing(true);
    try {
      const response = await blogPostService.rejectBlogPost(id, user.id);
      toast.success(response.message || t("success.postRejected"));
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        const detailResponse = await blogPostService.getBlogPostById(id);
        setSelectedPost(detailResponse.data);
      }
    } catch (err: any) {
      console.error("Error rejecting blog post:", err);
      toast.error(err.message || t("errors.rejectFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewPost = async (id: string) => {
    setIsProcessing(true);
    try {
      const response = await blogPostService.getBlogPostById(id);
      setSelectedPost(response.data);
      setCurrentView("detail");
    } catch (err: any) {
      console.error("Error fetching blog post details:", err);
      toast.error(err.message || t("errors.fetchDetailFailed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPosts =
    activeTab === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.status === activeTab.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 transition-colors duration-200">
      <div className="mx-auto max-w-full lg:max-w-7xl">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("title")}
          </h1>
          <div className="flex space-x-2 sm:space-x-4">
            {currentView === "list" && (
              <Button
                onClick={() => {
                  setSelectedPost(null);
                  setCurrentView("create");
                }}
                className="w-full sm:w-auto text-sm sm:text-base"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                {t("actions.createNew")}
              </Button>
            )}
            {(currentView === "create" || currentView === "detail") && (
              <Button
                variant="outline"
                onClick={() => setCurrentView("list")}
                className="w-full sm:w-auto text-sm sm:text-base"
                disabled={isProcessing}
              >
                {t("actions.backToList")}
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300">
            {t("welcome")},{" "}
            {user ? `${user.firstName} ${user.lastName}` : t("guest")}!
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size="lg" showText={true} />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 text-red-800 dark:text-red-300 transition-colors duration-200">
            {error}
          </div>
        ) : (
          <>
            {currentView === "list" && (
              <div className="rounded-lg bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 shadow transition-colors duration-200">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-4 sm:mb-6 grid w-full grid-cols-2 sm:grid-cols-5 gap-1">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                      {t("tabs.all")}
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="text-xs sm:text-sm">
                      {t("tabs.draft")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending_review"
                      className="text-xs sm:text-sm"
                    >
                      {t("tabs.pendingReview")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="approved"
                      className="text-xs sm:text-sm"
                    >
                      {t("tabs.approved")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="published"
                      className="text-xs sm:text-sm"
                    >
                      {t("tabs.published")}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value={activeTab}>
                    <BlogPostList
                      blogPosts={filteredPosts}
                      onViewPost={handleViewPost}
                      onDeletePost={handleDeleteBlogPost}
                      onPublishPost={handlePublishBlogPost}
                      onUnpublishPost={handleUnpublishBlogPost}
                      onApprovePost={handleApproveBlogPost}
                      onRejectPost={handleRejectBlogPost}
                      isProcessing={isProcessing}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {currentView === "create" && (
              <div className="rounded-lg bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 shadow transition-colors duration-200">
                <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {t("createPost.title")}
                </h2>
                <BlogPostForm
                  onSubmit={handleCreateBlogPost}
                  isProcessing={isProcessing}
                />
              </div>
            )}

            {currentView === "detail" && selectedPost && (
              <div className="rounded-lg bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 shadow transition-colors duration-200">
                <BlogPostDetail
                  blogPost={selectedPost}
                  onUpdate={handleUpdateBlogPost}
                  onDelete={handleDeleteBlogPost}
                  onPublish={handlePublishBlogPost}
                  onUnpublish={handleUnpublishBlogPost}
                  onApprove={handleApproveBlogPost}
                  onReject={handleRejectBlogPost}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
