// src/app/[locale]/(protected)/blog-management/_components/BlogPostForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { BlogPost, BlogPostStatus } from "@/types/entities/blogPost";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "./style.scss";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import TiptapEditor, { type TiptapEditorRef } from "@/components/TiptapEditor";
import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { fileUrlService } from "@/services/fileUrl.service";

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  bannerImageUrl: z
    .string()
    .url("Banner image must be a valid URL")
    .or(z.string().length(0)),
  status: z.enum(["DRAFT", "PENDING_REVIEW"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BlogPostFormProps {
  blogPost?: BlogPost;
  onSubmit: (
    data: FormValues
  ) => Promise<{ success: boolean; message: string }>;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ blogPost, onSubmit }) => {
  const t = useTranslations("blogPost");
  const { success, error } = useToast();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef<TiptapEditorRef>(null);
  const [isFormReady, setIsFormReady] = useState(false);
  const [initialContent, setInitialContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      bannerImageUrl: "",
      status: "DRAFT" as BlogPostStatus,
    },
  });

  // Function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  // Populate form when editing an existing blog post
  useEffect(() => {
    if (blogPost) {
      // Store the content separately for the editor
      setInitialContent(blogPost.content);

      form.reset({
        title: blogPost.title,
        content: blogPost.content,
        bannerImageUrl: blogPost.bannerImageUrl || "",
        status: blogPost.status === "PUBLISHED" ? "DRAFT" : blogPost.status,
      });

      if (blogPost.bannerImageUrl) {
        setPreviewImage(blogPost.bannerImageUrl);
      }
    }

    // Mark form as ready after initial data is set
    setIsFormReady(true);
  }, [blogPost, form]);

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      // Generate slug from title
      const slug = generateSlug(data.title);

      // Add slug to the submitted data
      const submissionData = {
        ...data,
        slug,
      };

      const result = await onSubmit(submissionData);

      if (result.success) {
        success(result.message || t("submitSuccess"));
      } else {
        error(result.message || t("submitError"));
      }
    } catch (err: any) {
      error(err.message || t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    form.setValue("bannerImageUrl", url);
    setPreviewImage(url);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);

      const result = await fileUrlService.uploadMultipleFilesCommunication([
        files[0],
      ]);

      if (result.data && result.data.length > 0) {
        const fileUrl = result.data[0].fileUrl;
        handleImageUrlChange(fileUrl);
        success(result.message || t("imageUploadSuccess"));
      } else {
        error(result.message || t("imageUploadError"));
      }
    } catch (err: any) {
      error(err.message || t("imageUploadError"));
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get word count from editor
  const getWordCount = () => {
    return (
      editorRef.current?.getInstance()?.storage.characterCount.words() ?? 0
    );
  };

  // Wait until form is ready before rendering
  if (!isFormReady) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner size="md" showText={true} />
      </div>
    );
  }

  return (
    <Card className="transition-colors duration-300 dark:bg-gray-800">
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
                  <FormLabel className="dark:text-gray-200">
                    {t("title")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("titlePlaceholder")}
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t("slug")}: {generateSlug(field.value)}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bannerImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">
                    {t("bannerImage")}
                  </FormLabel>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("bannerImagePlaceholder")}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                      />
                    </FormControl>
                    <div className="flex-shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                        disabled={isUploading}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        {isUploading ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : null}
                        {t("uploadImage")}
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                  <FormMessage />
                  {previewImage && (
                    <div className="mt-4">
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        {t("preview")}:
                      </p>
                      <div className="w-full overflow-hidden rounded-md">
                        <div className="w-full sm:w-full md:w-full lg:w-3/4 xl:w-2/3 mx-auto">
                          <Image
                            src={previewImage}
                            alt={t("bannerPreviewAlt")}
                            width={1200}
                            height={630}
                            className="w-full h-auto rounded-md"
                            style={{ objectFit: "contain" }}
                            onError={() => setPreviewImage(null)}
                            unoptimized
                          />
                        </div>
                      </div>
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
                  <FormLabel className="dark:text-gray-200">
                    {t("content")}
                  </FormLabel>
                  <FormControl>
                    <div className="min-h-[300px] border border-input rounded-md dark:border-gray-600">
                      <Controller
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                          <TiptapEditor
                            ref={editorRef}
                            key={blogPost?.id || "new-post"} // Force re-render when blog post changes
                            ssr={true}
                            output="html"
                            placeholder={{
                              paragraph: t("contentPlaceholder"),
                              imageCaption: t("imageCaptionPlaceholder"),
                            }}
                            contentMinHeight={280}
                            contentMaxHeight={600}
                            onContentChange={(content) => {
                              // Update form value when content changes
                              field.onChange(content);
                            }}
                            initialContent={initialContent} // Use separate state for initial content
                          />
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t("wordCount")}: {getWordCount()}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel className="dark:text-gray-200">
                    {t("status")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                      <SelectItem value="DRAFT">{t("draft")}</SelectItem>
                      <SelectItem value="PENDING_REVIEW">
                        {t("pendingReview")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white transition-colors"
              >
                {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
                {blogPost ? t("updatePost") : t("createPost")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BlogPostForm;
