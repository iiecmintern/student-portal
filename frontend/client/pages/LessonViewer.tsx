import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Settings,
  Download,
  FileText,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  Star,
} from "lucide-react";

const lessonData = {
  id: 3,
  title: "Creating Your First React App",
  description:
    "In this lesson, we'll create our first React application using Create React App and explore the project structure.",
  duration: "18:20",
  courseId: 1,
  courseTitle: "Complete React Developer Course",
  sectionTitle: "Getting Started with React",
  isCompleted: false,
  videoUrl:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  transcript: `Welcome to this lesson on creating your first React app. 

In this video, we'll be using Create React App, which is the official way to bootstrap a new React project. This tool sets up everything you need to start building a React application.

First, let's make sure you have Node.js installed on your system. You can check this by running "node --version" in your terminal.

Once you have Node.js installed, you can create a new React app by running "npx create-react-app my-first-app". This command will download and install all the necessary dependencies.

After the installation is complete, you can navigate to your project folder and start the development server by running "npm start".

Let's take a look at the project structure that Create React App generates for us...`,
  resources: [
    {
      id: 1,
      title: "React Project Setup Guide",
      type: "pdf",
      size: "2.5 MB",
      url: "#",
    },
    {
      id: 2,
      title: "Code Examples",
      type: "zip",
      size: "850 KB",
      url: "#",
    },
    {
      id: 3,
      title: "Cheat Sheet",
      type: "pdf",
      size: "1.2 MB",
      url: "#",
    },
  ],
  notes: [
    {
      id: 1,
      timestamp: "2:15",
      content: "Remember to install Node.js version 14 or higher",
      isPublic: false,
    },
    {
      id: 2,
      timestamp: "5:30",
      content: "The src folder contains all our React components",
      isPublic: false,
    },
  ],
  discussions: [
    {
      id: 1,
      user: "Alex Thompson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      timestamp: "2 hours ago",
      content:
        "Great explanation! I was confused about the project structure before watching this.",
      likes: 12,
      replies: 3,
      isLiked: false,
    },
    {
      id: 2,
      user: "Sarah Kim",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      timestamp: "1 day ago",
      content:
        "Quick question: Do we need to install any additional packages for this project?",
      likes: 5,
      replies: 1,
      isLiked: true,
    },
  ],
  nextLesson: {
    id: 4,
    title: "Understanding JSX",
    duration: "22:15",
  },
  previousLesson: {
    id: 2,
    title: "Setting up Development Environment",
    duration: "20:45",
  },
};

const courseProgress = {
  completedLessons: 2,
  totalLessons: 35,
  progressPercentage: 6,
};

export default function LessonViewer() {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(135); // 2:15
  const [duration] = useState(1100); // 18:20 in seconds
  const [volume, setVolume] = useState(75);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newComment, setNewComment] = useState("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player Section */}
      <div className="bg-black">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link
                to={`/course/${lessonData.courseId}`}
                className="text-white hover:text-primary"
              >
                <BookOpen className="h-5 w-5" />
              </Link>
              <div className="text-white">
                <h1 className="text-lg font-semibold">{lessonData.title}</h1>
                <p className="text-sm text-gray-300">
                  {lessonData.courseTitle} • {lessonData.sectionTitle}
                </p>
              </div>
            </div>
            <div className="text-white text-sm">
              Lesson {lessonData.id} of {courseProgress.totalLessons}
            </div>
          </div>

          {/* Video Player */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop"
                    alt="Video thumbnail"
                    className="mx-auto rounded-lg"
                  />
                </div>
                <Button
                  size="lg"
                  className="rounded-full p-4"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-2">
                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-primary"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-primary"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-primary"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-4 w-4" />
                      <div className="w-20 bg-white/20 rounded-full h-1">
                        <div
                          className="bg-white h-1 rounded-full"
                          style={{ width: `${volume}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-primary"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-primary"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 text-white">
            <div className="flex items-center space-x-4">
              {lessonData.previousLesson && (
                <Link
                  to={`/lesson/${lessonData.previousLesson.id}`}
                  className="flex items-center space-x-2 hover:text-primary"
                >
                  <SkipBack className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-xs text-gray-300">Previous</p>
                    <p className="text-sm">{lessonData.previousLesson.title}</p>
                  </div>
                </Link>
              )}
            </div>

            <div className="text-center">
              <Progress
                value={courseProgress.progressPercentage}
                className="w-32 h-2"
              />
              <p className="text-xs text-gray-300 mt-1">
                {courseProgress.completedLessons} of{" "}
                {courseProgress.totalLessons} lessons
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {lessonData.nextLesson && (
                <Link
                  to={`/lesson/${lessonData.nextLesson.id}`}
                  className="flex items-center space-x-2 hover:text-primary"
                >
                  <div className="text-right">
                    <p className="text-xs text-gray-300">Next</p>
                    <p className="text-sm">{lessonData.nextLesson.title}</p>
                  </div>
                  <SkipForward className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{lessonData.title}</h1>
                <Button
                  variant={lessonData.isCompleted ? "default" : "outline"}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    {lessonData.isCompleted ? "Completed" : "Mark Complete"}
                  </span>
                </Button>
              </div>
              <p className="text-muted-foreground mb-4">
                {lessonData.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{lessonData.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>1,240 students watching</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Lesson Overview
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <p>
                        In this comprehensive lesson, you'll learn how to create
                        your first React application using Create React App, the
                        official tool for bootstrapping React projects.
                      </p>
                      <h4>What you'll learn:</h4>
                      <ul>
                        <li>How to set up a new React project</li>
                        <li>Understanding the project structure</li>
                        <li>Exploring the default files and folders</li>
                        <li>Running your first React application</li>
                        <li>Making your first modifications</li>
                      </ul>
                      <h4>Key Concepts:</h4>
                      <ul>
                        <li>Create React App CLI tool</li>
                        <li>React project structure</li>
                        <li>NPM scripts and dependencies</li>
                        <li>Development server</li>
                        <li>Hot reloading</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Downloadable Resources
                    </h3>
                    <div className="space-y-3">
                      {lessonData.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {resource.type.toUpperCase()} • {resource.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transcript">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Video Transcript
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTranscript(!showTranscript)}
                      >
                        {showTranscript ? "Hide" : "Show"} Timestamps
                      </Button>
                    </div>
                    <div className="prose prose-sm max-w-none whitespace-pre-line">
                      {lessonData.transcript}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Add a Note</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Current time: {formatTime(currentTime)}</span>
                        </div>
                        <Textarea
                          placeholder="Add your note here..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <Button>Save Note</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">My Notes</h3>
                      <div className="space-y-3">
                        {lessonData.notes.map((note) => (
                          <div
                            key={note.id}
                            className="p-4 border rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{note.timestamp}</Badge>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Delete
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="discussions">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Join the Discussion
                      </h3>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Ask a question or share your thoughts..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button>Post Comment</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    {lessonData.discussions.map((discussion) => (
                      <Card key={discussion.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={discussion.avatar} />
                              <AvatarFallback>
                                {discussion.user[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {discussion.user}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {discussion.timestamp}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm">{discussion.content}</p>
                              <div className="flex items-center space-x-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={
                                    discussion.isLiked ? "text-primary" : ""
                                  }
                                >
                                  <ThumbsUp className="mr-1 h-4 w-4" />
                                  {discussion.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageCircle className="mr-1 h-4 w-4" />
                                  Reply ({discussion.replies})
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Course Progress */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Course Progress
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {courseProgress.progressPercentage}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {courseProgress.completedLessons} of{" "}
                        {courseProgress.totalLessons} lessons completed
                      </p>
                    </div>
                    <Progress value={courseProgress.progressPercentage} />
                    <div className="flex justify-between text-sm">
                      <span>Continue Learning</span>
                      <span>
                        {courseProgress.totalLessons -
                          courseProgress.completedLessons}{" "}
                        lessons left
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Lessons */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Up Next</h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: 4,
                        title: "Understanding JSX",
                        duration: "22:15",
                        isNext: true,
                      },
                      {
                        id: 5,
                        title: "Functional vs Class Components",
                        duration: "25:30",
                        isNext: false,
                      },
                      {
                        id: 6,
                        title: "Props and Component Communication",
                        duration: "30:45",
                        isNext: false,
                      },
                    ].map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/lesson/${lesson.id}`}
                        className={`block p-3 rounded-lg border transition-colors ${
                          lesson.isNext
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-2">
                              {lesson.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                          {lesson.isNext && (
                            <Badge variant="default" className="ml-2">
                              Next
                            </Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Download Resources
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Ask Instructor
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Star className="mr-2 h-4 w-4" />
                      Rate Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
