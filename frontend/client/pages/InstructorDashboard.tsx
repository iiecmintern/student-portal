import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  price: number;
  thumbnail_url: string | null;
  status: string;
  created_by: any;
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    tags: "",
    price: "",
  });

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/courses/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateOrUpdateCourse = async () => {
    const formData = new FormData();
    formData.append("title", newCourse.title);
    formData.append("description", newCourse.description);
    formData.append("category", newCourse.category);
    formData.append("difficulty", newCourse.difficulty);
    formData.append("tags", newCourse.tags);
    formData.append("price", newCourse.price);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const token = localStorage.getItem("token");
    const url = isEditMode
      ? `http://localhost:3001/api/courses/${editingCourse?._id}`
      : "http://localhost:3001/api/courses";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        alert(isEditMode ? "Course updated!" : "Course created!");
        resetForm();
        fetchMyCourses();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("Course deleted");
        fetchMyCourses();
      } else {
        alert(data.message || "Deletion failed");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setIsEditMode(true);
    setShowCreateCourse(true);
    setNewCourse({
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      tags: course.tags.join(", "),
      price: course.price.toString(),
    });
    setThumbnail(null);
    setThumbnailPreview(course.thumbnail_url ? `http://localhost:3001${course.thumbnail_url}` : null);
  };

  const resetForm = () => {
    setShowCreateCourse(false);
    setIsEditMode(false);
    setEditingCourse(null);
    setNewCourse({ title: "", description: "", category: "", difficulty: "", tags: "", price: "" });
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  return (
    <AppLayout>
      <div className="container py-8 px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
          <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                {isEditMode ? "Edit Course" : "Create Course"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Course" : "Create New Course"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newCourse.category}
                      onValueChange={(value) => setNewCourse({ ...newCourse, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="data-science">Data Science</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select
                      value={newCourse.difficulty}
                      onValueChange={(value) => setNewCourse({ ...newCourse, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newCourse.tags}
                    onChange={(e) => setNewCourse({ ...newCourse, tags: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Course Thumbnail</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                  {thumbnailPreview && (
                    <img src={thumbnailPreview} alt="preview" className="mt-2 h-24 w-24 rounded object-cover" />
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateOrUpdateCourse}>
                    {isEditMode ? "Update Course" : "Create Course"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Course List */}
        {loading ? (
          <p>Loading your courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-muted-foreground">No courses created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
                {course.thumbnail_url && (
                  <img
                    src={`http://localhost:3001${course.thumbnail_url}`}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{course.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <p className="mt-2 font-medium text-primary">${course.price}</p>
                  <p className="text-xs text-gray-500 capitalize">{course.category} • {course.difficulty}</p>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(course)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course._id)}>
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
