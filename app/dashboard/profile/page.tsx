"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/lib/auth-context";
import { ProfileService } from "@/lib/services/profile";
import type { User, ExperienceLevel } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Plus, X } from "lucide-react";

export default function ProfilePage() {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<User>>({});
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!authUser) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await ProfileService.getProfile();
        setProfile(data);
        setFormData(data);
      } catch {
        // Fallback for demo if it fails to fetch
        setProfile(authUser);
        setFormData(authUser);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!isAuthLoading) {
      if (authUser) {
        loadProfile();
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false);
      }
    }
  }, [authUser, isAuthLoading]);

  const handleSave = async () => {
    if (!profile) return;
    try {
      setIsSaving(true);
      setError(null);
      const updated = await ProfileService.updateProfile(formData);
      setProfile(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
    setError(null);
  };

  const updateField = <K extends keyof User>(field: K, value: User[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === "keydown" && (e as React.KeyboardEvent).key !== "Enter") || !newSkill.trim()) return;
    e.preventDefault();
    const skills = formData.skills || [];
    if (!skills.includes(newSkill.trim())) {
      updateField("skills", [...skills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    const skills = formData.skills || [];
    updateField("skills", skills.filter((s) => s !== skillToRemove));
  };

  const togglePreference = (pref: string, checked: boolean) => {
    const prefs = formData.workPreferences || [];
    if (checked) {
      updateField("workPreferences", [...prefs, pref]);
    } else {
      updateField("workPreferences", prefs.filter((p) => p !== pref));
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" description="Manage your skills, goals, and preferences." />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" description="Manage your skills, goals, and preferences." />
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Please log in to view your profile.
          </CardContent>
        </Card>
      </div>
    );
  }

  const workPrefs = formData.workPreferences || [];
  const displayUser = isEditing ? formData : profile;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Profile"
          description="Manage your skills, goals, and preferences."
          className="pb-0 mb-0"
        />
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-sm text-green-500 mr-2">Profile saved successfully!</span>
          )}
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Header Profile Section */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-background border-b" />
        <CardContent className="relative pt-0 sm:pt-0">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-12 sm:-mt-16 mb-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background rounded-full bg-muted">
              <AvatarImage src={displayUser.avatarUrl} alt={displayUser.name || "Avatar"} />
              <AvatarFallback className="text-2xl">{displayUser.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <h2 className="text-2xl font-bold">{displayUser.name || "Unnamed User"}</h2>
              <p className="text-muted-foreground mt-1 text-lg">
                {displayUser.role || "Add your professional role"}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="font-medium capitalize">{displayUser.experienceLevel}</span> Experience
                </span>
                {displayUser.location && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>{displayUser.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal details and current role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              {isEditing ? (
                <Input
                  value={formData.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Jane Doe"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{profile.name || "Not set"}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Role</label>
              {isEditing ? (
                <Input
                  value={formData.role || ""}
                  onChange={(e) => updateField("role", e.target.value)}
                  placeholder="e.g. Frontend Developer"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{profile.role || "Not set"}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              {isEditing ? (
                <Input
                  value={formData.location || ""}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{profile.location || "Not set"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience & Preferences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experience Level</CardTitle>
              <CardDescription>How would you rate your professional experience?</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(val) => { if (val) updateField("experienceLevel", val as ExperienceLevel) }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm capitalize text-muted-foreground">
                  {profile.experienceLevel || "Not set"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opportunity Preferences</CardTitle>
              <CardDescription>What kind of work environment are you looking for?</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  {["remote", "hybrid", "on-site"].map((pref) => (
                    <label key={pref} className="flex items-center gap-3">
                      <Checkbox
                        checked={workPrefs.includes(pref)}
                        onCheckedChange={(checked) => togglePreference(pref, checked === true)}
                      />
                      <span className="text-sm capitalize">{pref}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.workPreferences?.length ? (
                    profile.workPreferences.map((pref) => (
                      <Badge key={pref} variant="secondary" className="capitalize">
                        {pref}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No preferences selected.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add skills to help us match you with relevant opportunities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(displayUser.skills || []).length > 0 ? (
                (displayUser.skills || []).map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-destructive focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2">No skills added yet.</p>
              )}
            </div>
            {isEditing && (
              <div className="flex gap-2 max-w-sm mt-4">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={addSkill}
                />
                <Button type="button" variant="secondary" onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
            <CardDescription>Topics and fields you are passionate about.</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                placeholder="e.g. Artificial Intelligence, Open Source, UI/UX Design (comma separated)"
                value={(formData.interests || []).join(", ")}
                onChange={(e) =>
                  updateField(
                    "interests",
                    e.target.value.split(",").map((i) => i.trim()).filter(Boolean)
                  )
                }
                className="min-h-[100px]"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(profile.interests || []).length > 0 ? (
                  (profile.interests || []).map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No interests added.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Career Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Career Goals</CardTitle>
            <CardDescription>What you aim to achieve in your career.</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                placeholder="e.g. Lead a team, Learn a new language (comma separated)"
                value={(formData.goals || []).join(", ")}
                onChange={(e) =>
                  updateField(
                    "goals",
                    e.target.value.split(",").map((g) => g.trim()).filter(Boolean)
                  )
                }
                className="min-h-[100px]"
              />
            ) : (
              <ul className="space-y-2">
                {(profile.goals || []).length > 0 ? (
                  (profile.goals || []).map((goal, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {goal}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No goals added.</p>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
