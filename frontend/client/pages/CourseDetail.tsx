import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AppLayout from "@/components/layout/AppLayout";
import {
  BookOpen,
  Users,
  Star,
  Clock,
  Play,
  Download,
  Share,
  Heart,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Lock,
  Globe,
  Award,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";

const courseData = {
  id: 1,
  title: "Complete React Developer Course",
  subtitle: "Master React from beginner to advanced with real-world projects",
  instructor: {
    name: "Sarah Johnson",
    title: "Senior Frontend Developer at Google",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5f5?w=100&h=100&fit=crop&crop=face",
    rating: 4.9,
    students: 50000,
    courses: 12,
  },
  rating: 4.9,
  reviewCount: 2840,
  students: 12450,
  price: 79.99,
  originalPrice: 129.99,
  image:
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  level: "Intermediate",
  duration: "40 hours",
  category: "Web Development",
  language: "English",
  lastUpdated: "November 2024",
  description: `This comprehensive React course will take you from a complete beginner to an advanced React developer. You'll learn modern React patterns, hooks, context, and state management while building real-world projects.

By the end of this course, you'll have the confidence to build production-ready React applications and advance your career as a frontend developer.`,
  whatYouWillLearn: [
    "Build modern React applications from scratch",
    "Master React Hooks and functional components",
    "Implement state management with Context API and Redux",
    "Create responsive and accessible user interfaces",
    "Deploy React applications to production",
    "Test React components with Jest and React Testing Library",
    "Optimize React applications for performance",
    "Work with APIs and handle asynchronous operations",
  ],
  requirements: [
    "Basic knowledge of HTML, CSS, and JavaScript",
    "Familiarity with ES6+ JavaScript features",
    "A computer with internet connection",
    "Code editor (VS Code recommended)",
  ],
  targetAudience: [
    "Aspiring frontend developers",
    "JavaScript developers wanting to learn React",
    "Developers looking to update their React skills",
    "Anyone interested in modern web development",
  ],
  sections: [
    {
      id: 1,
      title: "Getting Started with React",
      lessons: 8,
      duration: "2h 30m",
      lessons_detail: [
        {
          id: 1,
          title: "Introduction to React",
          duration: "15:30",
          isCompleted: true,
          isFree: true,
        },
        {
          id: 2,
          title: "Setting up Development Environment",
          duration: "20:45",
          isCompleted: true,
          isFree: true,
        },
        {
          id: 3,
          title: "Creating Your First React App",
          duration: "18:20",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 4,
          title: "Understanding JSX",
          duration: "22:15",
          isCompleted: false,
          isFree: false,
        },
      ],
    },
    {
      id: 2,
      title: "Components and Props",
      lessons: 12,
      duration: "4h 15m",
      lessons_detail: [
        {
          id: 5,
          title: "Functional vs Class Components",
          duration: "25:30",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 6,
          title: "Props and Component Communication",
          duration: "30:45",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 7,
          title: "Conditional Rendering",
          duration: "20:20",
          isCompleted: false,
          isFree: false,
        },
      ],
    },
    {
      id: 3,
      title: "State Management and Hooks",
      lessons: 15,
      duration: "5h 45m",
      lessons_detail: [
        {
          id: 8,
          title: "useState Hook",
          duration: "28:30",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 9,
          title: "useEffect Hook",
          duration: "35:45",
          isCompleted: false,
          isFree: false,
        },
        {
          id: 10,
          title: "Custom Hooks",
          duration: "25:20",
          isCompleted: false,
          isFree: false,
        },
      ],
    },
  ],
  reviews: [
    {
      id: 1,
      user: "Mike Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent course! Sarah explains complex concepts in a very clear and understandable way. The projects are practical and really help solidify the learning.",
      helpful: 24,
    },
    {
      id: 2,
      user: "Emily Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      rating: 5,
      date: "1 month ago",
      comment:
        "This course completely transformed my understanding of React. The step-by-step approach and real-world examples make it perfect for beginners and intermediate developers.",
      helpful: 18,
    },
    {
      id: 3,
      user: "Alex Thompson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      rating: 4,
      date: "2 months ago",
      comment:
        "Great content and well-structured curriculum. The only minor issue is that some videos could be a bit shorter, but overall fantastic value for money.",
      helpful: 12,
    },
  ],
};

export default function CourseDetail() {
  const { id } = useParams();
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <AppLayout>
      <div className="bg-slate-900 text-white">
        <div className="container px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary-foreground"
                  >
                    {courseData.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white"
                  >
                    {courseData.level}
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {courseData.title}
                </h1>

                <p className="text-xl text-slate-300">{courseData.subtitle}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{courseData.rating}</span>
                    <span className="text-slate-300">
                      ({courseData.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{courseData.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>{courseData.language}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={courseData.instructor.avatar} />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{courseData.instructor.name}</p>
                    <p className="text-sm text-slate-300">
                      {courseData.instructor.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Video Preview */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <div className="relative">
                  <img
                    src={courseData.image}
                    alt={courseData.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-t-lg">
                    <Button size="lg" className="rounded-full p-4">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      ${courseData.price}
                    </div>
                    <div className="text-sm text-muted-foreground line-through">
                      ${courseData.originalPrice}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Enrolled
                  </Button>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{courseData.duration} on-demand video</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Lifetime access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      About this course
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {courseData.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      What you'll learn
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {courseData.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {courseData.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            • {req}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Who this course is for
                      </h3>
                      <ul className="space-y-2">
                        {courseData.targetAudience.map((audience, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            • {audience}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Course Content</h3>
                  <p className="text-sm text-muted-foreground">
                    {courseData.sections.reduce(
                      (acc, section) => acc + section.lessons,
                      0,
                    )}{" "}
                    lessons • {courseData.duration}
                  </p>
                </div>

                <div className="space-y-2">
                  {courseData.sections.map((section) => (
                    <Card key={section.id}>
                      <CardContent className="p-0">
                        <button
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50"
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center space-x-3">
                            {expandedSections.includes(section.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <div>
                              <h4 className="font-medium">{section.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {section.lessons} lessons • {section.duration}
                              </p>
                            </div>
                          </div>
                        </button>

                        {expandedSections.includes(section.id) && (
                          <div className="border-t">
                            {section.lessons_detail.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/30"
                              >
                                <div className="flex items-center space-x-3">
                                  {lesson.isCompleted ? (
                                    <CheckCircle className="h-4 w-4 text-success" />
                                  ) : lesson.isFree ? (
                                    <Play className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <div>
                                    <p className="font-medium">
                                      {lesson.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {lesson.duration}
                                    </p>
                                  </div>
                                </div>
                                {lesson.isFree && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link to={`/lesson/${lesson.id}`}>
                                      Preview
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructor">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={courseData.instructor.avatar} />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold">
                          {courseData.instructor.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {courseData.instructor.title}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{courseData.instructor.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {courseData.instructor.students.toLocaleString()}{" "}
                              students
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{courseData.instructor.courses} courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Sarah is a Senior Frontend Developer at Google with over 8
                      years of experience in web development. She specializes in
                      React, TypeScript, and modern web technologies. Sarah has
                      taught thousands of students worldwide and is passionate
                      about making complex concepts accessible to everyone.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Student Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-medium">
                      {courseData.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({courseData.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {courseData.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{review.user}</p>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                Helpful ({review.helpful})
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageCircle className="mr-1 h-4 w-4" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Courses */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Related Courses</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-3">
                      <img
                        src={`https://images.unsplash.com/photo-${
                          i % 2 === 0
                            ? "1558655146-d09347e92766"
                            : "1627398242454-45a1465c2479"
                        }?w=80&h=60&fit=crop`}
                        alt="Course"
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-medium line-clamp-2">
                          Advanced React Patterns Course {i}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          John Doe
                        </p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.8</span>
                          <span className="text-xs text-primary font-medium">
                            $59.99
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
