import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/components/layout/AppLayout";
import { Eye, MoreHorizontal, Search, Shield, X } from "lucide-react";
import axios from "axios";

interface UserRow {
  _id: string;
  full_name: string;
  email: string;
  createdAt: string;
  is_active: boolean;
  courses_count?: number;
  total_spent?: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axios.get("http://localhost:3001/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("❌ Failed to load users", err);
      setError(err.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const viewUserProfile = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setSelectedUser(res.data.data);
        setShowProfileModal(true);
      } else {
        alert("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("❌ Error fetching profile", err);
      alert("Error fetching user profile");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((old) => old.filter((u) => u._id !== id));
    } catch (err) {
      console.error("❌ Delete failed", err);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const filteredUsers = (users ?? []).filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Admin metrics go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2 text-muted-foreground" />
                <Input
                  className="pl-8 w-64"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="text-red-600 font-medium">{error}</div>}

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{u.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {u.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={u.is_active ? "default" : "secondary"}
                          >
                            {u.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{u.courses_count ?? 0}</TableCell>
                        <TableCell>
                          ${(u.total_spent ?? 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => viewUserProfile(u._id)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteUser(u._id)}
                                className="text-destructive"
                              >
                                <Shield className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Profile Modal */}
        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Profile</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowProfileModal(false)}
                >
                  <X />
                </Button>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {selectedUser.full_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.is_active ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
