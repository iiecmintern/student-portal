import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/components/layout/AppLayout";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  Search,
  Download,
  Filter,
  Calendar,
  Award,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Shield,
  BarChart3,
  PieChart,
  Activity,
  Globe,
} from "lucide-react";

const adminData = {
  stats: {
    totalUsers: 125000,
    newUsersToday: 342,
    totalCourses: 1250,
    activeCourses: 987,
    totalRevenue: 2500000,
    monthlyRevenue: 180000,
    certificatesIssued: 45000,
    newCertificates: 1200,
  },
  recentActivity: [
    {
      id: 1,
      type: "user_signup",
      message: "342 new users registered today",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "course_published",
      message: "Advanced Python Course published by Dr. Sarah Chen",
      time: "4 hours ago",
      status: "info",
    },
    {
      id: 3,
      type: "payment_issue",
      message: "Payment processing issue detected",
      time: "6 hours ago",
      status: "warning",
    },
    {
      id: 4,
      type: "system_maintenance",
      message: "Scheduled maintenance completed successfully",
      time: "8 hours ago",
      status: "success",
    },
  ],
  topCourses: [
    {
      id: 1,
      title: "Complete React Developer Course",
      instructor: "Sarah Johnson",
      students: 12450,
      revenue: 995000,
      rating: 4.9,
      status: "active",
      enrollments_trend: "+15%",
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      instructor: "Dr. Michael Chen",
      students: 8230,
      revenue: 740000,
      rating: 4.8,
      status: "active",
      enrollments_trend: "+8%",
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Emma Rodriguez",
      students: 15680,
      revenue: 1100000,
      rating: 4.9,
      status: "active",
      enrollments_trend: "+12%",
    },
  ],
  topInstructors: [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5f5?w=50&h=50&fit=crop&crop=face",
      courses: 12,
      students: 45000,
      revenue: 890000,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      courses: 8,
      students: 32000,
      revenue: 650000,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      courses: 15,
      students: 55000,
      revenue: 1200000,
      rating: 4.9,
    },
  ],
  userGrowth: [
    { month: "Jan", users: 95000, revenue: 150000 },
    { month: "Feb", users: 98000, revenue: 155000 },
    { month: "Mar", users: 102000, revenue: 162000 },
    { month: "Apr", users: 108000, revenue: 170000 },
    { month: "May", users: 115000, revenue: 175000 },
    { month: "Jun", users: 125000, revenue: 180000 },
  ],
  recentUsers: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      joinDate: "2024-11-15",
      status: "active",
      courses: 3,
      spent: 249.97,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      joinDate: "2024-11-14",
      status: "active",
      courses: 1,
      spent: 79.99,
    },
    {
      id: 3,
      name: "Carol Williams",
      email: "carol@example.com",
      joinDate: "2024-11-13",
      status: "inactive",
      courses: 0,
      spent: 0,
    },
  ],
  systemHealth: {
    serverUptime: "99.9%",
    apiResponseTime: "125ms",
    activeConnections: 15670,
    storageUsed: "78%",
    cdnPerformance: "Excellent",
    errorRate: "0.02%",
  },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30d");

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_signup":
        return <Users className="h-4 w-4" />;
      case "course_published":
        return <BookOpen className="h-4 w-4" />;
      case "payment_issue":
        return <AlertTriangle className="h-4 w-4" />;
      case "system_maintenance":
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-destructive";
      default:
        return "text-info";
    }
  };

  return (
    <AppLayout>
      <div className="container px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor platform performance and manage your LMS
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {adminData.stats.totalUsers.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">
                        +{adminData.stats.newUsersToday} today
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      ${adminData.stats.monthlyRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Monthly Revenue
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">+12.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {adminData.stats.activeCourses.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active Courses
                    </p>
                    <p className="text-xs text-muted-foreground">
                      of {adminData.stats.totalCourses} total
                    </p>
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
                    <p className="text-2xl font-bold">
                      {adminData.stats.certificatesIssued.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Certificates Issued
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-xs text-success">
                        +{adminData.stats.newCertificates} this month
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <div
                          className={`p-2 rounded-full bg-muted ${getActivityColor(activity.status)}`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Server Uptime
                      </p>
                      <p className="text-2xl font-bold text-success">
                        {adminData.systemHealth.serverUptime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        API Response
                      </p>
                      <p className="text-2xl font-bold">
                        {adminData.systemHealth.apiResponseTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Active Users
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {adminData.systemHealth.activeConnections.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Storage Used
                      </p>
                      <p className="text-2xl font-bold text-warning">
                        {adminData.systemHealth.storageUsed}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CDN Performance</span>
                      <Badge variant="default" className="bg-success">
                        {adminData.systemHealth.cdnPerformance}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">Error Rate</span>
                      <span className="text-sm font-medium text-success">
                        {adminData.systemHealth.errorRate}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Growth & Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Growth chart visualization would be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminData.recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.courses}</TableCell>
                      <TableCell>${user.spent.toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Shield className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Course Analytics</h3>
              <Button>Add New Course</Button>
            </div>

            <div className="grid gap-6">
              {adminData.topCourses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {course.title}
                        </h4>
                        <p className="text-muted-foreground">
                          by {course.instructor}
                        </p>
                      </div>
                      <Badge
                        variant={
                          course.status === "active" ? "default" : "secondary"
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {course.students.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Students
                        </p>
                        <p className="text-xs text-success">
                          {course.enrollments_trend}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">
                          ${course.revenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-warning">
                          {course.rating}
                        </p>
                        <p className="text-sm text-muted-foreground">Rating</p>
                      </div>
                      <div className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Data
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Top Instructors</h3>
              <Button>Invite Instructor</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {adminData.topInstructors.map((instructor) => (
                <Card key={instructor.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={instructor.avatar} />
                        <AvatarFallback>
                          {instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{instructor.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{instructor.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Courses
                        </span>
                        <span className="font-medium">
                          {instructor.courses}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Students
                        </span>
                        <span className="font-medium">
                          {instructor.students.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Revenue
                        </span>
                        <span className="font-medium text-success">
                          ${instructor.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    ${adminData.stats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">
                    ${adminData.stats.monthlyRevenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-success">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning">$89.50</div>
                  <p className="text-sm text-muted-foreground">
                    Per transaction
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Revenue breakdown chart would be displayed here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Server Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Web Server</span>
                    <Badge variant="default" className="bg-success">
                      Online
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <Badge variant="default" className="bg-success">
                      Online
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CDN</span>
                    <Badge variant="default" className="bg-success">
                      Online
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payment Gateway</span>
                    <Badge variant="default" className="bg-success">
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">CPU Usage</span>
                      <span className="text-sm">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Memory</span>
                      <span className="text-sm">68%</span>
                    </div>
                    <Progress value={68} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Storage</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Bandwidth</span>
                      <span className="text-sm">32%</span>
                    </div>
                    <Progress value={32} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent System Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: "2024-11-15 14:30",
                      event: "Scheduled backup completed",
                      status: "success",
                    },
                    {
                      time: "2024-11-15 12:15",
                      event: "Database optimization started",
                      status: "info",
                    },
                    {
                      time: "2024-11-15 10:45",
                      event: "CDN cache cleared",
                      status: "info",
                    },
                    {
                      time: "2024-11-15 09:20",
                      event: "Security scan completed - no issues found",
                      status: "success",
                    },
                  ].map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          event.status === "success" ? "default" : "secondary"
                        }
                        className={
                          event.status === "success" ? "bg-success" : ""
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
