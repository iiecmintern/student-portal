import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Download,
  Video,
  ArrowRight,
  ArrowLeft,
  Link,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const BACKEND_URL = "http://localhost:3001";

export default function LessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/lessons/${id}`);
        setLesson(res.data.data);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleNextLesson = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lessons/${id}/next`);
      const nextLesson = res.data?.data;
      if (nextLesson?._id) {
        navigate(`/lesson/${nextLesson._id}`);
      } else {
        alert("No next lesson available.");
      }
    } catch {
      alert("No next lesson available.");
    }
  };

  const handlePreviousLesson = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/lessons/${id}/prev`);
      const prevLesson = res.data?.data;
      if (prevLesson?._id) {
        navigate(`/lesson/${prevLesson._id}`);
      } else {
        alert("No previous lesson available.");
      }
    } catch {
      alert("No previous lesson available.");
    }
  };

  if (loading)
    return (
      <AppLayout>
        <div className="p-8">Loading...</div>
      </AppLayout>
    );
  if (error)
    return (
      <AppLayout>
        <div className="p-8 text-red-500">{error}</div>
      </AppLayout>
    );
  if (!lesson) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground">
          Duration:{" "}
          {lesson.duration
            ? `${Math.floor(lesson.duration / 60)}m ${lesson.duration % 60}s`
            : "N/A"}
        </p>

        {/* Video Embed */}
        {lesson.video_embed_url && (
          <div className="aspect-video mb-4">
            <iframe
              src={lesson.video_embed_url}
              title="Lesson Video"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <Card>
          <CardContent className="prose max-w-none p-6">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </CardContent>
        </Card>

        {/* Attachments */}
        {/* Attachments */}
        {lesson.attachments?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Attachments</h2>
            {lesson.attachments.map((file: any) => {
              const fileUrl = `${BACKEND_URL}/uploads/lessons/${file.filename}`;
              return (
                <div key={file.filename} className="flex items-center gap-3">
                  {file.type.startsWith("video") ? (
                    <Video className="text-blue-600" />
                  ) : (
                    <FileText className="text-blue-600" />
                  )}

                  {/* Open in new tab */}
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-700 hover:text-blue-900"
                  >
                    {file.original_name}
                  </a>

                  {/* Download button */}
                  <a
                    href={fileUrl}
                    download={file.original_name}
                    className="ml-2 inline-flex items-center px-2 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Resources */}
        {lesson.resources?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resources</h2>
            {lesson.resources.map((res: any, idx: number) => (
              <div key={idx} className="p-4 border rounded-md space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Link className="text-blue-600" />
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-700"
                  >
                    {res.title}
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  {res.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePreviousLesson}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous Lesson
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleNextLesson}
          >
            Next Lesson <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
