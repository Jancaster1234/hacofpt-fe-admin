// src/app/(protected)/profile/_components/InformationTab.tsx
// src/app/profile/_components/InformationTab.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User } from "@/types/entities/user";
import { Badge } from "@/components/ui/badge";
import { X, Pencil, Save, XCircle } from "lucide-react";

interface InformationTabProps {
  user: User;
  onUpdateUser: (updatedUser: Partial<User>) => Promise<void>;
}

export default function InformationTab({ user, onUpdateUser }: InformationTabProps) {
  const [editing, setEditing] = useState(false);
  const [tempUser, setTempUser] = useState<Partial<User>>({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    phone: user.phone,
    skills: user.skills
  });
  const [newSkill, setNewSkill] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingLoading, setIsVerifyingLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updateData = {
        firstName: tempUser.firstName,
        lastName: tempUser.lastName,
        bio: tempUser.bio,
        phone: tempUser.phone,
        skills: tempUser.skills
      };

      await onUpdateUser(updateData);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempUser({
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      phone: user.phone,
      skills: user.skills
    });
    setEditing(false);
    setNewSkill("");
  };

  const handleChange = (key: keyof User, value: string) => {
    setTempUser({ ...tempUser, [key]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !tempUser.skills?.includes(newSkill.trim())) {
      setTempUser({
        ...tempUser,
        skills: [...(tempUser.skills || []), newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTempUser({
      ...tempUser,
      skills: tempUser.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  const handleAddEmail = async () => {
    try {
      setEmailError("");
      if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        setEmailError("Please enter a valid email address");
        return;
      }

      setIsLoading(true);
      const response = await fetch('/api/user/add-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ email: newEmail })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to add email');
      }

      setPendingEmail(newEmail);
      setIsVerifying(true);
      setIsAddingEmail(false);
      setNewEmail("");
      toast.success("Email added successfully. Please verify your email.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add email";
      setEmailError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setVerificationError("");
      if (!otp || otp.length !== 6) {
        setVerificationError("Please enter a valid 6-digit OTP");
        return;
      }

      setIsVerifyingLoading(true);
      const response = await fetch('/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          email: pendingEmail,
          otp: otp
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to verify email');
      }

      toast.success("Email verified successfully");
      setIsVerifying(false);
      setOtp("");
      await onUpdateUser({ email: pendingEmail });
      setPendingEmail("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify email";
      setVerificationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifyingLoading(false);
    }
  };

  const fields: (keyof User)[] = [
    "firstName",
    "lastName",
    "bio",
    "phone",
  ];

  return (
    <div className="mt-6">
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            {!editing && (
              <Button
                size="sm"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Pencil size={16} />
                Edit
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Details Section */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  {editing ? (
                    <Input
                      value={tempUser.firstName || ""}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <Input
                      value={user.firstName || ""}
                      className="w-full"
                      disabled
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  {editing ? (
                    <Input
                      value={tempUser.lastName || ""}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <Input
                      value={user.lastName || ""}
                      className="w-full"
                      disabled
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  {editing ? (
                    <Input
                      value={tempUser.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <Input
                      value={user.bio || ""}
                      className="w-full"
                      disabled
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  {editing ? (
                    <Input
                      value={tempUser.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <Input
                      value={user.phone || ""}
                      className="w-full"
                      disabled
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Email and Skills */}
            <div>
              {/* Email Section */}
              <div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  {isAddingEmail ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="flex-1"
                          type="email"
                          disabled={isLoading}
                        />
                        <Button
                          onClick={handleAddEmail}
                          className="bg-sky-500 hover:bg-sky-600 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>
                      </div>
                      {emailError && (
                        <p className="text-sm text-red-500">{emailError}</p>
                      )}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsAddingEmail(false);
                          setNewEmail("");
                          setEmailError("");
                        }}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        <XCircle size={16} />
                        Cancel
                      </Button>
                    </div>
                  ) : isVerifying ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Please enter the verification code sent to {pendingEmail}
                      </p>
                      <div className="flex gap-2">
                        <Input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit code"
                          className="flex-1"
                          maxLength={6}
                          disabled={isVerifyingLoading}
                        />
                        <Button
                          onClick={handleVerifyEmail}
                          className="bg-sky-500 hover:bg-sky-600 text-white"
                          disabled={isVerifyingLoading}
                        >
                          {isVerifyingLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      </div>
                      {verificationError && (
                        <p className="text-sm text-red-500">{verificationError}</p>
                      )}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsVerifying(false);
                          setOtp("");
                          setPendingEmail("");
                          setVerificationError("");
                        }}
                        className="flex items-center gap-2"
                        disabled={isVerifyingLoading}
                      >
                        <XCircle size={16} />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        value={user.email || ""}
                        className="w-full"
                        disabled
                        placeholder="No email address added"
                      />
                      {!user.email && !isAddingEmail && !isVerifying && !editing && (
                        <Button
                          size="sm"
                          onClick={() => setIsAddingEmail(true)}
                          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white whitespace-nowrap"
                        >
                          <Pencil size={16} />
                          Add Email
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  {editing ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Add new skill"
                          className="flex-1"
                        />
                        <Button
                          onClick={handleAddSkill}
                          className="bg-sky-500 hover:bg-sky-600 text-white whitespace-nowrap"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {tempUser.skills?.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center gap-1 bg-sky-50 text-sky-700 hover:bg-sky-100"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-sky-50 text-sky-700"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No skills added yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex gap-2">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <XCircle size={16} />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
