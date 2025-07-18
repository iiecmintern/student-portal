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
import QuizAttempt from "@/components/QuizAttempt";

const BACKEND_URL = "http://localhost:3001";

export default function LessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any | null>(null);
  const [quiz, setQuiz] = useState<any | null>(null);
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

  useEffect(() => {
  const fetchQuiz = async () => {
    if (lesson?.quiz && typeof lesson.quiz === "string") {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/quizzes/${lesson.quiz}`);
        if (res.data?.data?.questions?.length > 0) {
          setQuiz(res.data.data);
        } else {
          setQuiz(null); // No valid quiz
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setQuiz(null);
      }
    } else if (lesson?.quiz?.questions?.length > 0) {
      setQuiz(lesson.quiz); // Already populated and valid
    } else {
      setQuiz(null); // No valid quiz
    }
  };
  fetchQuiz();
}, [lesson]);


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

        {/* Attachments */}
        {lesson.attachments?.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Attachments</h2>
            {lesson.attachments.map((file: any) => {
              const fileUrl = `${BACKEND_URL}/uploads/lessons/${file.filename}`;
              const isVideo = file.type.startsWith("video/");
              const isPDF = file.type === "application/pdf";

              return (
                <div key={file.filename} className="space-y-2">
                  <div className="flex items-center gap-3">
                    {isVideo ? <Video className="text-blue-600" /> : <FileText className="text-blue-600" />}
                    <span className="font-medium">{file.original_name}</span>
                    <a
                      href={fileUrl}
                      download={file.original_name}
                      className="ml-2 inline-flex items-center px-2 py-1 border border-gray-300 text-sm rounded hover:bg-gray-100"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </a>
                  </div>
                  {isVideo && (
                    <video controls className="w-full max-w-3xl rounded shadow">
                      <source src={fileUrl} type={file.type} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {isPDF && (
                    <iframe
                      src={fileUrl}
                      title="PDF Preview"
                      className="w-full h-[600px] border rounded"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Main Content */}
        <Card>
          <CardContent className="prose max-w-none p-6">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </CardContent>
        </Card>

        {/* Video */}
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
                <p className="text-sm text-muted-foreground">{res.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quiz */}
        {quiz && quiz.questions?.length > 0 ? (
          <QuizAttempt quiz={quiz} lessonId={lesson._id} />
        ) : (
          <p></p>
        )}

        {/* Duration */}
        <p className="text-muted-foreground text-sm">
          Duration:{" "}
          {lesson.duration
            ? `${Math.floor(lesson.duration / 60)}m ${lesson.duration % 60}s`
            : "N/A"}
        </p>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePreviousLesson}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous Lesson
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleNextLesson}>
            Next Lesson <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
