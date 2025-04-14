// src/services/blogPost.service.ts
import { apiService } from "@/services/apiService_v0";
import { BlogPost, BlogPostStatus } from "@/types/entities/blogPost";
import { handleApiError } from "@/utils/errorHandler";

class BlogPostService {
  async getAllBlogPosts(): Promise<{ data: BlogPost[]; message?: string }> {
    try {
      const response = await apiService.auth.get<BlogPost[]>(
        "/hackathon-service/api/v1/blog-posts"
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve blog posts");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BlogPost[]>(
        error,
        [],
        "[BlogPost Service] Error getting blog posts:"
      );
    }
  }

  async getBlogPostById(
    id: string
  ): Promise<{ data: BlogPost; message?: string }> {
    try {
      const response = await apiService.auth.get<BlogPost>(
        `/hackathon-service/api/v1/blog-posts/${id}`
      );

      if (!response || !response.data) {
        throw new Error("Failed to retrieve blog post");
      }

      return {
        data: response.data,
        message: response.message,
      };
    } catch (error: any) {
      return handleApiError<BlogPost>(
        error,
        {} as BlogPost,
        "[BlogPost Service] Error getting blog post:"
      );
    }
  }

  async createBlogPost(data: {
    title: string;
    content: string;
    bannerImageUrl: string;
    slug?: string;
    status?: BlogPostStatus;
  }): Promise<{ data: BlogPost; message?: string }> {
    try {
      // Default to DRAFT status if not provided
      const blogPostData = {
        ...data,
        status: data.status || "DRAFT",
      };

      const response = await apiService.auth.post<BlogPost>(
        "/hackathon-service/api/v1/blog-posts",
        { data: blogPostData }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to create blog post");
      }

      return {
        data: response.data,
        message: response.message || "Blog post created successfully",
      };
    } catch (error: any) {
      return handleApiError<BlogPost>(
        error,
        {} as BlogPost,
        "[BlogPost Service] Error creating blog post:"
      );
    }
  }

  async updateBlogPost(data: {
    id: string;
    title?: string;
    content?: string;
    bannerImageUrl?: string;
    slug?: string;
    status?: BlogPostStatus;
  }): Promise<{ data: BlogPost; message?: string }> {
    try {
      const response = await apiService.auth.put<BlogPost>(
        `/hackathon-service/api/v1/blog-posts`,
        { data: data }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to update blog post");
      }

      return {
        data: response.data,
        message: response.message || "Blog post updated successfully",
      };
    } catch (error: any) {
      return handleApiError<BlogPost>(
        error,
        {} as BlogPost,
        "[BlogPost Service] Error updating blog post:"
      );
    }
  }

  async deleteBlogPost(id: string): Promise<{ message?: string }> {
    try {
      const response = await apiService.auth.delete(
        `/hackathon-service/api/v1/blog-posts/${id}`
      );

      return {
        message: response.message || "Blog post deleted successfully",
      };
    } catch (error: any) {
      console.error(
        "[BlogPost Service] Error deleting blog post:",
        error.message
      );
      throw error;
    }
  }

  async publishBlogPost(
    id: string
  ): Promise<{ data: BlogPost; message?: string }> {
    try {
      const response = await apiService.auth.put<BlogPost>(
        `/hackathon-service/api/v1/blog-posts/${id}/publish`,
        {}
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to publish blog post");
      }

      return {
        data: response.data,
        message: response.message || "Blog post published successfully",
      };
    } catch (error: any) {
      return handleApiError<BlogPost>(
        error,
        {} as BlogPost,
        "[BlogPost Service] Error publishing blog post:"
      );
    }
  }

  async unpublishBlogPost(
    id: string
  ): Promise<{ data: BlogPost; message?: string }> {
    try {
      const response = await apiService.auth.put<BlogPost>(
        `/hackathon-service/api/v1/blog-posts/${id}/unpublish`,
        {}
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to unpublish blog post");
      }

      return {
        data: response.data,
        message: response.message || "Blog post unpublished successfully",
      };
    } catch (error: any) {
      return handleApiError<BlogPost>(
        error,
        {} as BlogPost,
        "[BlogPost Service] Error unpublishing blog post:"
      );
    }
  }
  async approveBlogPost(
    id: string,
    reviewedById: string
  ): Promise<{ data: BlogPost; message?: string }> {
    try {
      const response = await apiService.auth.put<BlogPost>(
        `/hackathon-service/api/v1/blog-posts/${id}/approve`,
        { data: { reviewedById } }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to approve blog post");
      }

      return {
        data: response.data,
        message: response.message || "Blog post approved successfully",
      };
    } catch (error: any) {
      return handleApiError<BlogPost>(
        error,
        {} as BlogPost,
        "[BlogPost Service] Error approving blog post:"
      );
    }
  }

  async rejectBlogPost(
    id: string,
    reviewedById: string
  ): Promise<{ data: BlogPost; message?: string }> {
    try {
      const response = await apiService.auth.put<BlogPost>(
        `/hackathon-service/api/v1/blog-posts/${id}/reject`,
        { data: { reviewedById } }
      );

      if (!response || !response.data) {
        throw new Error(response?.message || "Failed to reject blog post");
      }

      return {
        data: response.data,
        message: response.message || "Blog post rejected successfully",
      };
    } catch (error: any) {
      return handleApiError<BlogPost>(
        error,
        {} as BlogPost,
        "[BlogPost Service] Error rejecting blog post:"
      );
    }
  }
}

export const blogPostService = new BlogPostService();
