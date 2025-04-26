// src/app/(protected)/blog-management/_components/BlogPostForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { BlogPost, BlogPostStatus } from "@/types/entities/blogPost";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  bannerImageUrl: z.string().url("Banner image must be a valid URL"),
  slug: z.string().optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
  blogPost?: BlogPost;
  onSubmit: (data: FormValues) => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ blogPost, onSubmit }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      bannerImageUrl: "",
      slug: "",
      status: "DRAFT" as BlogPostStatus,
    },
  });

  // Populate form when editing an existing blog post
  useEffect(() => {
    if (blogPost) {
      form.reset({
        title: blogPost.title,
        content: blogPost.content,
        bannerImageUrl: blogPost.bannerImageUrl || "",
        slug: blogPost.slug,
        status: blogPost.status === "PUBLISHED" ? "DRAFT" : blogPost.status,
      });

      if (blogPost.bannerImageUrl) {
        setPreviewImage(blogPost.bannerImageUrl);
      }
    }
  }, [blogPost, form]);

  const handleSubmit = (data: FormValues) => {
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
    }

    onSubmit(data);
  };

  const handleImageUrlChange = (url: string) => {
    form.setValue("bannerImageUrl", url);
    setPreviewImage(url);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Blog post title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="blog-post-slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bannerImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/image.jpg"
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                  {previewImage && (
                    <div className="mt-2">
                      <p className="mb-1 text-sm text-gray-500">Preview:</p>
                      <img
                        src={previewImage}
                        alt="Banner preview"
                        className="mt-2 h-40 w-full rounded object-cover"
                        onError={() => setPreviewImage(null)}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Blog post content"
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PENDING_REVIEW">
                        Submit for Review
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                {blogPost ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BlogPostForm;
