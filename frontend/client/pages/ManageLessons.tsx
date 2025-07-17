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
  attachments?: UploadedFile[];
}

interface UploadedFile {
  filename: string;
  url: string;
  type: string;
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
  const [file, setFile] = useState<File | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await axios.get("http://localhost:3001/api/courses/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchLessons = async (courseId: string) => {
    setLoadingLessons(true);
    try {
      const res = await axios.get(
        `http://localhost:3001/api/lessons/course/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = res.data.data || [];
      setLessons(data);
      const nextOrder = data.length
        ? Math.max(...data.map((l: Lesson) => l.order)) + 1
        : 1;
      setNewLesson((prev) => ({ ...prev, order: nextOrder }));
    } catch (err) {
      console.error("Error fetching lessons:", err);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.content.trim()) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedFileInfo = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post(
          "http://localhost:3001/api/lessons/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        uploadedFileInfo = uploadRes.data.data;
      }

      const payload = {
        ...newLesson,
        course_id: selectedCourseId,
        attachments: uploadedFileInfo
          ? JSON.stringify([uploadedFileInfo])
          : JSON.stringify([]),
      };

      await axios.post("http://localhost:3001/api/lessons", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setNewLesson({
        title: "",
        content: "",
        order: newLesson.order + 1,
        duration: 10,
      });
      setFile(null);
      await fetchLessons(selectedCourseId);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error adding lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    setIsSubmitting(true);

    try {
      let uploadedFileInfo = null;
      if (file) {
        const formData = new FormData();
        formData.append("attachments", file);
        const uploadRes = await axios.post(
          "http://localhost:3001/api/lessons/upload",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        uploadedFileInfo = uploadRes.data.data;
      }

      const payload = new FormData();
      payload.append("title", newLesson.title);
      payload.append("content", newLesson.content);
      payload.append("order", String(newLesson.order));
      payload.append("duration", String(newLesson.duration));
      payload.append(
        "attachments",
        JSON.stringify([
          ...(editingLesson.attachments || []),
          ...(uploadedFileInfo ? [uploadedFileInfo] : []),
        ]),
      );

      await axios.put(
        `http://localhost:3001/api/lessons/${editingLesson._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEditingLesson(null);
      setFile(null);
      setNewLesson({
        title: "",
        content: "",
        order: newLesson.order + 1,
        duration: 10,
      });
      await fetchLessons(selectedCourseId);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error updating lesson");
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
      alert("Error deleting lesson");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) fetchLessons(selectedCourseId);
  }, [selectedCourseId]);

  useEffect(() => {
    if (editingLesson) {
      setNewLesson({
        title: editingLesson.title,
        content: editingLesson.content,
        order: editingLesson.order,
        duration: editingLesson.duration,
      });
      setFile(null);
    }
  }, [editingLesson]);

  const selectedCourse = courses.find((c) => c._id === selectedCourseId);

  return (
    <AppLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-4">Manage Lessons</h1>

        <div className="mb-6">
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
        </div>

        {selectedCourseId && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Lessons for: {selectedCourse?.title}
            </h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingLesson ? "Edit Lesson" : "Add New Lesson"}
                </CardTitle>
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
                <Input
                  type="file"
                  accept="video/*,application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                />
                {file && file.type.startsWith("video/") && (
                  <video className="w-full mt-2" controls height="240">
                    <source src={URL.createObjectURL(file)} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={
                      editingLesson ? handleUpdateLesson : handleAddLesson
                    }
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? editingLesson
                        ? "Updating..."
                        : "Adding..."
                      : editingLesson
                        ? "Update Lesson"
                        : "Add Lesson"}
                  </Button>
                  {editingLesson && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingLesson(null);
                        setNewLesson({
                          title: "",
                          content: "",
                          order: newLesson.order + 1,
                          duration: 10,
                        });
                        setFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
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
                    <CardContent className="py-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Order: {lesson.order}, Duration: {lesson.duration}{" "}
                            mins
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

                      {lesson.attachments?.map((att, i) => {
                        const fileUrl = `http://localhost:3001${att.url}`;
                        return (
                          <div key={i} className="text-sm mt-1">
                            {att.type.startsWith("video/") ? (
                              <video controls className="w-full max-w-md">
                                <source src={fileUrl} type={att.type} />
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <a
                                className="text-blue-600 underline"
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {att.filename}
                              </a>
                            )}
                          </div>
                        );
                      })}
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
