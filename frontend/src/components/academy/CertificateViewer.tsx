import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, CheckCircle2 } from "lucide-react";

interface CertificateProps {
  courseId: string;
  courseTitle: string;
  studentName: string;
  apiBase: string;
  language: string;
  progress: number;
}

export default function CertificateViewer({ courseId, courseTitle, studentName, apiBase, language, progress }: CertificateProps) {
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNL = language === "nl";
  const isCompleted = progress >= 100;

  const generateCert = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token") || "";
      const res = await fetch(`${apiBase}/academy/certificate/${courseId}/generate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setCertificate(await res.json());
      } else {
        // Fallback: show local certificate
        setCertificate({
          certificate_number: `PXP-${Date.now().toString(36).toUpperCase()}`,
          course_title: courseTitle,
          student_name: studentName,
          issued_at: new Date().toISOString(),
          course_duration: 0,
        });
      }
    } catch {
      setCertificate({
        certificate_number: `PXP-${Date.now().toString(36).toUpperCase()}`,
        course_title: courseTitle,
        student_name: studentName,
        issued_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  if (certificate) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardContent className="pt-8 text-center">
            <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <Badge className="bg-yellow-500 text-white mb-4">
              {isNL ? "Certificaat" : "Certificate"}
            </Badge>
            <h2 className="text-2xl font-bold mb-1">{certificate.course_title}</h2>
            <p className="text-muted-foreground mb-6">
              {isNL ? "Succesvol afgerond door" : "Successfully completed by"}
            </p>
            <p className="text-xl font-semibold mb-6">{certificate.student_name}</p>
            <div className="border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{isNL ? "Certificaat nr." : "Certificate no."} {certificate.certificate_number}</span>
              <span>{new Date(certificate.issued_at).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-3 mt-6 justify-center">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                {isNL ? "Delen" : "Share"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 text-center">
      <Award className={`w-16 h-16 mx-auto mb-4 ${isCompleted ? "text-yellow-500" : "text-muted-foreground/30"}`} />
      <h3 className="text-lg font-semibold mb-2">
        {isNL ? "Certificaat" : "Certificate"}
      </h3>
      {isCompleted ? (
        <>
          <p className="text-muted-foreground mb-4">
            {isNL 
              ? "Gefeliciteerd! Je hebt alle lessen voltooid. Genereer je certificaat."
              : "Congratulations! You completed all lessons. Generate your certificate."}
          </p>
          <Button onClick={generateCert} disabled={loading} className="bg-yellow-500 hover:bg-yellow-600">
            {loading ? (isNL ? "Genereren..." : "Generating...") : (isNL ? "Certificaat genereren" : "Generate Certificate")}
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted-foreground mb-2">
            {isNL 
              ? `Rond alle lessen af om je certificaat te ontvangen. (${progress}% klaar)`
              : `Complete all lessons to receive your certificate. (${progress}% done)`}
          </p>
          <div className="w-48 mx-auto">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
