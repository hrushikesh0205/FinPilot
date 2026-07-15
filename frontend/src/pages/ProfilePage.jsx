import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Camera,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getProfile, updateProfileDetails, uploadProfileImage } from '@/services/authApi';
import { format } from 'date-fns';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const { toast } = useToast();
  const { updateUser } = useAuth();

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
      // Ensure global user state has the image on load if they just logged in
      updateUser({ name: res.data.name, profileImage: res.data.profileImage });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load profile data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openEditDialog = () => {
    setEditData({
      name: profile?.name || '',
      phone: profile?.phoneNumber || '',
    });
    setIsEditOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editData.name.trim()) {
      toast({ title: 'Validation error', description: 'Name cannot be empty.', variant: 'destructive' });
      return;
    }
    
    try {
      setIsSaving(true);
      const res = await updateProfileDetails(editData.name.trim(), editData.phone.trim());
      setProfile(res.data);
      
      // Update global context
      updateUser({ name: res.data.name });
      
      setIsEditOpen(false);
      toast({ title: 'Success', description: 'Profile updated successfully.' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPG, JPEG, PNG)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPG, JPEG, or PNG image.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await uploadProfileImage(formData);
      setProfile(res.data);
      updateUser({ profileImage: res.data.profileImage });
      toast({ title: 'Success', description: 'Profile image updated.' });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err?.response?.data?.message || 'Could not upload image.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset file input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!profile) return null;

  const imageUrl = getImageUrl(profile.profileImage);
  
  // Format member since date
  const memberSince = profile.createdAt 
    ? format(new Date(profile.createdAt), 'MMMM yyyy')
    : 'Unknown';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and personal information
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/20 group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/20 flex items-center justify-center text-emerald-600 text-3xl font-bold uppercase group-hover:bg-emerald-500/20 transition-colors">
                  {profile.name.charAt(0)}
                </div>
              )}
              <button 
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg, image/jpg, image/png"
                className="hidden"
              />
            </div>
            
            <div className="text-center sm:text-left flex-1 mt-2">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Member since {memberSince}
              </p>
            </div>
            
            <Button
              variant="outline"
              className="gap-2 mt-2"
              onClick={openEditDialog}
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <div className="p-3 rounded-lg bg-muted/50 font-medium">
                {profile.name}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="p-3 rounded-lg bg-muted/50 font-medium">
                {profile.email}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <div className="p-3 rounded-lg bg-muted/50 font-medium">
                {profile.phoneNumber || 'Not provided'}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Member Since
              </Label>
              <div className="p-3 rounded-lg bg-muted/50 font-medium">
                {memberSince}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                placeholder="e.g. +91 9876543210"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600 gap-2"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
