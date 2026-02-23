import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ExamEngineProps {
  examId: string;
  apiBase: string;
  language: string;
  onComplete?: (passed: boolean, score: number) => void;
}

export default function ExamEngine({ examId, apiBase, language, onComplete }: ExamEngineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam - Coming Soon</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Exam functionality will be implemented</p>
      </CardContent>
    </Card>
  );
}
