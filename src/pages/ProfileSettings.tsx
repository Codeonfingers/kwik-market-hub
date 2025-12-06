import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Phone, 
  CreditCard, 
  Camera, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

// Validation schemas
const phoneSchema = z.string()
  .length(10, "Phone number must be exactly 10 digits")
  .regex(/^0[2-5][0-9]{8}$/, "Invalid Ghanaian phone number");

const ghanaCardSchema = z.string()
  .regex(/^GHA-[0-9]{9}-[0-9]$/, "Format: GHA-XXXXXXXXX-X");

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    ghanaCardNumber: "",
    avatarUrl: "",
    isVerified: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    if (user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    if (data) {
      setProfile({
        fullName: data.full_name || "",
        phone: data.phone || "",
        ghanaCardNumber: data.ghana_card_number || "",
        avatarUrl: data.avatar_url || "",
        isVerified: data.is_verified || false,
      });
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (profile.phone) {
      try {
        phoneSchema.parse(profile.phone);
      } catch (e) {
        if (e instanceof z.ZodError) newErrors.phone = e.errors[0].message;
      }
    }
    
    if (profile.ghanaCardNumber) {
      try {
        ghanaCardSchema.parse(profile.ghanaCardNumber);
      } catch (e) {
        if (e instanceof z.ZodError) newErrors.ghanaCardNumber = e.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    setProfile({ ...profile, avatarUrl: publicUrl });
    setUploading(false);
    toast.success("Avatar uploaded");
  };

  const handleSave = async () => {
    if (!user || !validateForm()) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.fullName,
        phone: profile.phone,
        ghana_card_number: profile.ghanaCardNumber,
        avatar_url: profile.avatarUrl,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated successfully");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-xl font-bold">Profile Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload a photo for your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="text-2xl">{initials || "?"}</AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -bottom-1 -right-1 rounded-full w-8 h-8"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{profile.fullName || "Your Name"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {profile.isVerified ? (
                    <Badge variant="success" className="mt-2">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mt-2">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Kofi Asante"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="0244123456"
                    value={profile.phone}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10) 
                    })}
                    className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ghanaCard">Ghana Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="ghanaCard"
                    placeholder="GHA-XXXXXXXXX-X"
                    value={profile.ghanaCardNumber}
                    onChange={(e) => setProfile({ ...profile, ghanaCardNumber: e.target.value.toUpperCase() })}
                    className={`pl-10 ${errors.ghanaCardNumber ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.ghanaCardNumber && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.ghanaCardNumber}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Required for verification. Your Ghana Card helps verify your identity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            variant="hero" 
            className="w-full" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfileSettings;
