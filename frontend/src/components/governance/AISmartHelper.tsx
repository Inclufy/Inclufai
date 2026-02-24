import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslations } from '@/hooks/usePageTranslations';

interface AISmartHelperProps {
  type: "portfolio" | "board" | "stakeholder";
  onSuggestion: (data: any) => void;
  context?: string;
}

const AISmartHelper: React.FC<AISmartHelperProps> = ({ type, onSuggestion, context }) => {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const { pt } = usePageTranslations();

  const generateSmartSuggestions = async () => {
    setGenerating(true);

    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let suggestion: any = {};

      switch (type) {
        case "portfolio":
          suggestion = {
            name: "Digital Transformation Initiative 2025",
            description: "Strategic portfolio focused on modernizing legacy systems, implementing cloud infrastructure, and enhancing digital customer experiences. Includes data analytics platform, mobile app development, and AI/ML capabilities. Expected ROI: 25% within 18 months.",
          };
          break;

        case "board":
          suggestion = {
            name: "Strategic Investment Review Board",
            description: "Governance body responsible for reviewing and approving strategic investments, monitoring portfolio performance, and ensuring alignment with organizational objectives. Meets bi-weekly to assess progress and make funding decisions.",
          };
          break;

        case "stakeholder":
          suggestion = {
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            role: "Chief Digital Officer",
            organization: "Technology Division",
            interest_level: "high",
            influence_level: "high",
          };
          break;
      }

      onSuggestion(suggestion);

      toast({
        title: "✨ AI Suggestions Generated",
        description: "Smart fields have been populated. Review and adjust as needed.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to generate AI suggestions.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getPromptExamples = () => {
    switch (type) {
      case "portfolio":
        return [
          "Create a digital transformation portfolio",
          "Build a sustainability initiative",
          "Setup innovation program",
        ];
      case "board":
        return [
          "Investment review board",
          "Risk oversight committee",
          "Strategic planning board",
        ];
      case "stakeholder":
        return [
          "Add executive sponsor",
          "Include technical lead",
          "Add business owner",
        ];
    }
  };

  return (
    <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Wand2 className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Smart Creation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {pt("Let AI help you get started with intelligent suggestions")}
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase">Quick Prompts:</p>
              <div className="flex flex-wrap gap-2">
                {getPromptExamples().map((example, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={generateSmartSuggestions}
                    disabled={generating}
                    className="text-xs h-8 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={generateSmartSuggestions}
              disabled={generating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {pt("Generating...")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {pt("Generate with AI")}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISmartHelper;
