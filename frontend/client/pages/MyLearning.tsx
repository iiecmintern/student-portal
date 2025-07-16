import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, CheckCircle, Play } from "lucide-react";
import axios from "axios";

export default function MyLearning() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3001/api/enrollments/my-courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCourses(res.data.data);
      } catch (error) {
        console.error("Failed to fetch enrolled courses", error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Learning</h1>
          <p className="text-muted-foreground">
            Track your progress and continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Enrolled Courses
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Hours Learned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Award className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All My Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle>All My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.length === 0 ? (
                <p className="text-muted-foreground">
                  You have not enrolled in any courses yet.
                </p>
              ) : (
                courses.map((course: any) => (
                  <div
                    key={course._id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <img
                      src={
                        course.thumbnail_url
                          ? `http://localhost:3001${course.thumbnail_url}`
                          : "https://via.placeholder.com/120x80"
                      }
                      alt={course.title}
                      className="w-16 h-12 rounded object-cover"
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.instructor_name || "Instructor"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">0%</p>
                      <Progress value={0} className="w-20 h-2" />
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
