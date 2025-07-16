import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/components/layout/AppLayout";

interface Course {
  _id: string;
  title: string;
}

interface Lesson {
  _id: string;
  title: string;
  content: string;
  order: number;
  duration: number;
}

const ManageLessons = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    order: 1,
    duration: 10,
  });
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await axios.get("http://localhost:3001/api/courses/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCourses(res.data.data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      setLoadingLessons(true);
      const res = await axios.get(
        `http://localhost:3001/api/lessons/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.data || [];
      setLessons(data);
      const nextOrder = data.length ? Math.max(...data.map((l: Lesson) => l.order)) + 1 : 1;
      setNewLesson((prev) => ({ ...prev, order: nextOrder }));
    } catch (err) {
      console.error("❌ Error fetching lessons:", err);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.content.trim()) {
      alert("Please fill all fields");
      return;
    }
    try {
      setIsSubmitting(true);
      await axios.post(
        "http://localhost:3001/api/lessons",
        { ...newLesson, course_id: selectedCourseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchLessons(selectedCourseId);
      setNewLesson({ title: "", content: "", order: newLesson.order + 1, duration: 10 });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error adding lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchLessons(selectedCourseId);
    } catch (err) {
      console.error("❌ Failed to delete lesson:", err);
      alert("Error deleting lesson");
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    try {
      setIsSubmitting(true);
      await axios.put(
        `http://localhost:3001/api/lessons/${editingLesson._id}`,
        editingLesson,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchLessons(selectedCourseId);
      setEditingLesson(null);
    } catch (err) {
      console.error("❌ Failed to update lesson:", err);
      alert("Error updating lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) fetchLessons(selectedCourseId);
  }, [selectedCourseId]);

  const selectedCourse = courses.find((c) => c._id === selectedCourseId);

  return (
    <AppLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">Manage Lessons</h1>

        <div className="mb-6">
          {loadingCourses ? (
            <p className="text-muted">Loading courses...</p>
          ) : (
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="p-2 border rounded w-full sm:w-auto"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedCourseId && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Lessons for: {selectedCourse?.title}
            </h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Lesson</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Lesson Title"
                  value={newLesson.title}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, title: e.target.value })
                  }
                  disabled={isSubmitting}
                />
                <Textarea
                  placeholder="Lesson Content"
                  value={newLesson.content}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, content: e.target.value })
                  }
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  placeholder="Order"
                  value={newLesson.order}
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      order: Number(e.target.value),
                    })
                  }
                  disabled={isSubmitting}
                />
                <Input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newLesson.duration}
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      duration: Number(e.target.value),
                    })
                  }
                  disabled={isSubmitting}
                />
                <Button onClick={handleAddLesson} disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Lesson"}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {loadingLessons ? (
                <p>Loading lessons...</p>
              ) : lessons.length === 0 ? (
                <p>No lessons added yet.</p>
              ) : (
                lessons.map((lesson) => (
                  <Card key={lesson._id}>
                    <CardContent className="py-4">
                      {editingLesson?. _id === lesson._id ? (
                        <div className="space-y-2">
                          <Input
                            value={editingLesson.title}
                            onChange={(e) =>
                              setEditingLesson({
                                ...editingLesson,
                                title: e.target.value,
                              })
                            }
                          />
                          <Textarea
                            value={editingLesson.content}
                            onChange={(e) =>
                              setEditingLesson({
                                ...editingLesson,
                                content: e.target.value,
                              })
                            }
                          />
                          <Input
                            type="number"
                            value={editingLesson.order}
                            onChange={(e) =>
                              setEditingLesson({
                                ...editingLesson,
                                order: Number(e.target.value),
                              })
                            }
                          />
                          <Input
                            type="number"
                            value={editingLesson.duration}
                            onChange={(e) =>
                              setEditingLesson({
                                ...editingLesson,
                                duration: Number(e.target.value),
                              })
                            }
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleUpdateLesson}>Save</Button>
                            <Button variant="outline" onClick={() => setEditingLesson(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Order: {lesson.order}, Duration: {lesson.duration} mins
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingLesson(lesson)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteLesson(lesson._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default ManageLessons;
