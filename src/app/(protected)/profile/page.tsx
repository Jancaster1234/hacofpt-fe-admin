// src/app/(protected)/profile/page.tsx
"use client";

import Image from "next/image";
import InformationTab from "@/app/(protected)/profile/_components/InformationTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HackathonParticipatedTab from "@/app/(protected)/profile/_components/HackathonParticipatedTab";
import AwardTab from "@/app/(protected)/profile/_components/AwardTab";
import { useAuth } from "@/hooks/useAuth_v0";
import { User } from "@/types/entities/user";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import React from "react";

export default function ProfilePage() {
  const { user, checkUser } = useAuth();
  const setAuth = useAuthStore(state => state.setAuth);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpdateUser = async (updatedUser: Partial<User>) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/auth/my-info', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }

      const updatedUserData = await response.json();

      // Update auth store with new user data
      setAuth({ user: updatedUserData });

      // Refresh user data from server
      await checkUser();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch("/api/auth/upload-avatar", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload avatar");
      }

      const res = await response.json();

      // Update auth store with new avatar URL
      if (user) {
        setAuth({ user: { ...user, avatarUrl: res?.data?.avatarUrl } as User });
      }

      // Refresh user data from server
      await checkUser();

      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error("Upload avatar error:", error);
      toast.error("Failed to upload avatar");
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-8 items-center mb-8">
        <div className="relative group">
          <Image
            src={user?.avatarUrl || "https://randomuser.me/api/portraits/men/99.jpg"}
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full object-cover border shadow-md"
          />
          <div
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
            onClick={handleAvatarClick}
          >
            <Camera size={20} className="text-sky-500" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">{user.bio}</p>
        </div>
      </div>

      <Tabs defaultValue="information" className="w-full">
        <TabsList>
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="hackathon">Hackathon Participated</TabsTrigger>
          <TabsTrigger value="award">Award</TabsTrigger>
        </TabsList>

        <TabsContent value="information">
          <InformationTab user={user} onUpdateUser={handleUpdateUser} />
        </TabsContent>

        <TabsContent value="hackathon">
          <HackathonParticipatedTab user={user} />
        </TabsContent>

        <TabsContent value="award">
          <AwardTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
