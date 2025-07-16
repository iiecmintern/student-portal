import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/components/layout/AppLayout";
import {
  Download,
  Share2,
  Eye,
  Award,
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Linkedin,
  Twitter,
  Facebook,
  Copy,
  QrCode,
  Shield,
  Verified,
} from "lucide-react";

const certificateData = {
  id: "RC-2024-001234",
  title: "React Developer Certification",
  recipientName: "Alex Thompson",
  courseName: "Complete React Developer Course",
  courseId: 1,
  instructorName: "Sarah Johnson",
  instructorTitle: "Senior Frontend Developer at Google",
  instructorAvatar:
    "https://images.unsplash.com/photo-1494790108755-2616b612b5f5?w=100&h=100&fit=crop&crop=face",
  issueDate: "November 15, 2024",
  completionDate: "November 14, 2024",
  grade: "A+",
  finalScore: 95,
  totalHours: 40,
  skills: [
    "React.js",
    "JavaScript ES6+",
    "React Hooks",
    "Component Architecture",
    "State Management",
    "JSX",
  ],
  credentialUrl: "https://eduflow.com/certificates/RC-2024-001234",
  isVerified: true,
  expiryDate: null, // null means no expiry
  organization: {
    name: "EduFlow Learning Platform",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    website: "https://eduflow.com",
  },
};

export default function Certificate() {
  const { id } = useParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    // In a real app, this would trigger PDF download
    console.log("Downloading certificate...");
  };

  const handleShare = (platform: string) => {
    const url = certificateData.credentialUrl;
    const text = `I just earned my ${certificateData.title} from ${certificateData.organization.name}!`;

    switch (platform) {
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(certificateData.credentialUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link to="/profile" className="hover:text-primary">
              Profile
            </Link>
            <span>/</span>
            <span>Certificate</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {certificateData.title}
              </h1>
              <p className="text-muted-foreground">
                Certificate ID: {certificateData.id}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {certificateData.isVerified && (
                <Badge variant="default" className="bg-success">
                  <Verified className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Certificate Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative">
                {/* Certificate Design */}
                <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 md:p-12">
                  <div className="bg-white border-8 border-primary/20 rounded-lg p-8 md:p-12 shadow-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center space-x-4 mb-6">
                        <img
                          src={certificateData.organization.logo}
                          alt={certificateData.organization.name}
                          className="w-16 h-16 rounded-lg"
                        />
                        <div>
                          <h2 className="text-2xl font-bold text-primary">
                            {certificateData.organization.name}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Certificate of Completion
                          </p>
                        </div>
                      </div>
                      <Separator className="my-6" />
                    </div>

                    {/* Main Content */}
                    <div className="text-center space-y-6">
                      <div>
                        <h3 className="text-lg text-muted-foreground mb-2">
                          This certifies that
                        </h3>
                        <h1 className="text-4xl font-bold text-primary mb-4">
                          {certificateData.recipientName}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                          has successfully completed the course
                        </p>
                      </div>

                      <div className="py-4">
                        <h2 className="text-2xl font-bold mb-2">
                          {certificateData.courseName}
                        </h2>
                        <p className="text-muted-foreground">
                          with a final grade of{" "}
                          <span className="font-bold text-success">
                            {certificateData.grade}
                          </span>{" "}
                          ({certificateData.finalScore}%)
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 py-6">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Date of Completion
                          </p>
                          <p className="font-semibold">
                            {certificateData.completionDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Certificate ID
                          </p>
                          <p className="font-semibold font-mono">
                            {certificateData.id}
                          </p>
                        </div>
                      </div>

                      {/* Instructor Signature */}
                      <div className="flex items-center justify-center space-x-4 pt-8 border-t">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={certificateData.instructorAvatar} />
                          <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-semibold">
                            {certificateData.instructorName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {certificateData.instructorTitle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Course Instructor
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* QR Code and Security */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t">
                      <div className="flex items-center space-x-2">
                        <QrCode className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Verify at
                          </p>
                          <p className="text-xs font-mono">
                            eduflow.com/verify
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Issued on {certificateData.issueDate}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3 text-success" />
                          <p className="text-xs text-success">
                            Blockchain Verified
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Button onClick={handleDownload} size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="mr-2 h-5 w-5" />
                Share Certificate
              </Button>
              <Button variant="outline" size="lg">
                <ExternalLink className="mr-2 h-5 w-5" />
                Verify Online
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Certificate Details */}
            <Card>
              <CardHeader>
                <CardTitle>Certificate Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{certificateData.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Professional Certification
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {certificateData.recipientName}
                    </p>
                    <p className="text-sm text-muted-foreground">Recipient</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{certificateData.courseName}</p>
                    <p className="text-sm text-muted-foreground">
                      {certificateData.totalHours} hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{certificateData.issueDate}</p>
                    <p className="text-sm text-muted-foreground">
                      {certificateData.expiryDate
                        ? `Expires: ${certificateData.expiryDate}`
                        : "No expiration"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">
                      Grade: {certificateData.grade}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {certificateData.finalScore}% final score
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Earned */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Demonstrated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {certificateData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card>
              <CardHeader>
                <CardTitle>Share Your Achievement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleShare("linkedin")}
                >
                  <Linkedin className="mr-2 h-4 w-4 text-blue-600" />
                  Share on LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                  Share on Twitter
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleShare("facebook")}
                >
                  <Facebook className="mr-2 h-4 w-4 text-blue-700" />
                  Share on Facebook
                </Button>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Certificate URL:
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-muted rounded text-xs">
                      {certificateData.credentialUrl}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-success">
                    Blockchain Verified
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Verified className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Digitally Signed</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This certificate is cryptographically secured and can be
                  verified at any time using the certificate ID.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Verify Certificate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
