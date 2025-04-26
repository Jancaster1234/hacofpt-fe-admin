// src/app/(protected)/blog-management/page.tsx
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
import { Loader2 } from "lucide-react";

export default function BlogManagement() {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentView, setCurrentView] = useState<"list" | "create" | "detail">(
    "list"
  );
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const response = await blogPostService.getAllBlogPosts();
      setBlogPosts(response.data);
    } catch (err) {
      setError("Failed to fetch blog posts");
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
    try {
      // Calculate word count from HTML content
      const wordCount = calculateWordCount(data.content);

      await blogPostService.createBlogPost({
        ...data,
        wordCount,
      });
      fetchBlogPosts();
      setCurrentView("list");
    } catch (err) {
      console.error("Error creating blog post:", err);
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
    try {
      // Calculate word count if content is updated
      const updatedData = { ...data };
      if (data.content) {
        updatedData.wordCount = calculateWordCount(data.content);
      }

      await blogPostService.updateBlogPost(updatedData);
      if (selectedPost) {
        const response = await blogPostService.getBlogPostById(data.id);
        setSelectedPost(response.data);
      }
      fetchBlogPosts();
    } catch (err) {
      console.error("Error updating blog post:", err);
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
    try {
      await blogPostService.deleteBlogPost(id);
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        setSelectedPost(null);
        setCurrentView("list");
      }
    } catch (err) {
      console.error("Error deleting blog post:", err);
    }
  };

  const handlePublishBlogPost = async (id: string) => {
    try {
      await blogPostService.publishBlogPost(id);
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        const response = await blogPostService.getBlogPostById(id);
        setSelectedPost(response.data);
      }
    } catch (err) {
      console.error("Error publishing blog post:", err);
    }
  };

  const handleUnpublishBlogPost = async (id: string) => {
    try {
      await blogPostService.unpublishBlogPost(id);
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        const response = await blogPostService.getBlogPostById(id);
        setSelectedPost(response.data);
      }
    } catch (err) {
      console.error("Error unpublishing blog post:", err);
    }
  };

  const handleApproveBlogPost = async (id: string) => {
    if (!user?.id) return;
    try {
      await blogPostService.approveBlogPost(id, user.id);
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        const response = await blogPostService.getBlogPostById(id);
        setSelectedPost(response.data);
      }
    } catch (err) {
      console.error("Error approving blog post:", err);
    }
  };

  const handleRejectBlogPost = async (id: string) => {
    if (!user?.id) return;
    try {
      await blogPostService.rejectBlogPost(id, user.id);
      fetchBlogPosts();
      if (selectedPost && selectedPost.id === id) {
        const response = await blogPostService.getBlogPostById(id);
        setSelectedPost(response.data);
      }
    } catch (err) {
      console.error("Error rejecting blog post:", err);
    }
  };

  const handleViewPost = async (id: string) => {
    try {
      const response = await blogPostService.getBlogPostById(id);
      setSelectedPost(response.data);
      setCurrentView("detail");
    } catch (err) {
      console.error("Error fetching blog post details:", err);
    }
  };

  const filteredPosts =
    activeTab === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.status === activeTab.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <div className="flex space-x-4">
            {currentView === "list" && (
              <Button
                onClick={() => {
                  setSelectedPost(null);
                  setCurrentView("create");
                }}
              >
                Create New Post
              </Button>
            )}
            {(currentView === "create" || currentView === "detail") && (
              <Button variant="outline" onClick={() => setCurrentView("list")}>
                Back to List
              </Button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-700">
            Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-800">{error}</div>
        ) : (
          <>
            {currentView === "list" && (
              <div className="rounded-lg bg-white p-6 shadow">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6 grid w-full grid-cols-5">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="pending_review">
                      Pending Review
                    </TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
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
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {currentView === "create" && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-6 text-2xl font-semibold">
                  Create New Blog Post
                </h2>
                <BlogPostForm onSubmit={handleCreateBlogPost} />
              </div>
            )}

            {currentView === "detail" && selectedPost && (
              <div className="rounded-lg bg-white p-6 shadow">
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
