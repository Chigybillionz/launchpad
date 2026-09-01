"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  experienceLevel: string;
  location: string;
  createdAt: string;
};

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  
  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", role: "USER", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "USER", password: "" });
    setError("");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error?.message || "Failed to create user");
      
      setUsers([json.data, ...users]);
      setIsCreateOpen(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, role: formData.role }),
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error?.message || "Failed to update user");
      
      setUsers(users.map(u => u.id === selectedUser.id ? json.data : u));
      setIsEditOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error?.message || "Failed to delete user");
      
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, password: "" });
    setIsEditOpen(true);
  };

  const openDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="size-4 mr-2" /> Create User
        </Button>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-neutral-950/50 border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-neutral-300">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${u.role === "ADMIN" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-neutral-800 text-neutral-300"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-white">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/${u.id}`} className="cursor-pointer flex items-center">
                                <Eye className="mr-2 h-4 w-4" /> View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(u)} className="cursor-pointer flex items-center">
                              <Pencil className="mr-2 h-4 w-4" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDelete(u)} className="cursor-pointer flex items-center text-red-400 focus:text-red-400 focus:bg-red-500/10">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account manually.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="bg-transparent border-neutral-700 hover:bg-neutral-800">Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">{loading ? "Creating..." : "Create User"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details or promote to admin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-neutral-950 border-neutral-800" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="bg-transparent border-neutral-700 hover:bg-neutral-800">Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">{loading ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-red-400">
              Are you absolutely sure? This action cannot be undone and will delete all their applications and saved opportunities.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-neutral-300">You are about to delete <strong>{selectedUser?.name}</strong> ({selectedUser?.email}).</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="bg-transparent border-neutral-700 hover:bg-neutral-800">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} disabled={loading}>{loading ? "Deleting..." : "Delete User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
