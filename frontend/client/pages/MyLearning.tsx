import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Award,
  Play,
  CheckCircle,
  BarChart3,
} from "lucide-react";

export default function MyLearning() {
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
                  <p className="text-2xl font-bold">8</p>
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
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">127</p>
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
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&h=80&fit=crop"
                  alt="Course"
                  className="w-20 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">Complete React Developer</h3>
                  <p className="text-sm text-muted-foreground">
                    Lesson 8: State Management
                  </p>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>65% complete</span>
                    <span>26 of 40 lessons</span>
                  </div>
                </div>
                <Button size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Continue
                </Button>
              </div>

              <div className="flex space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=120&h=80&fit=crop"
                  alt="Course"
                  className="w-20 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">
                    Machine Learning Fundamentals
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Lesson 3: Linear Regression
                  </p>
                  <Progress value={23} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>23% complete</span>
                    <span>8 of 35 lessons</span>
                  </div>
                </div>
                <Button size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Courses */}
        <Card>
          <CardHeader>
            <CardTitle>All My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <img
                    src={`https://images.unsplash.com/photo-${
                      i % 2 === 0
                        ? "1633356122544-f134324a6cee"
                        : "1555949963-aa79dcee981c"
                    }?w=120&h=80&fit=crop`}
                    alt="Course"
                    className="w-16 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">Course Title {i}</h4>
                    <p className="text-sm text-muted-foreground">
                      Instructor Name
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{40 + i * 10}%</p>
                    <Progress value={40 + i * 10} className="w-20 h-2" />
                  </div>
                  <Badge variant={i % 3 === 0 ? "default" : "secondary"}>
                    {i % 3 === 0 ? "Completed" : "In Progress"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
