import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Video, ArrowRight } from "lucide-react";
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
      }
    } catch (error) {
      alert("No next lesson available.");
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
          Duration: {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
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
        {lesson.attachments?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Attachments</h2>
            {lesson.attachments.map((file: any) => (
              <div key={file.filename} className="flex items-center gap-3">
                {file.type.startsWith("video") ? (
                  <Video className="text-blue-600" />
                ) : (
                  <FileText className="text-blue-600" />
                )}
                <a
                  href={`${BACKEND_URL}${file.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700"
                >
                  {file.original_name}
                </a>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Next Lesson */}
        <div className="pt-6">
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
