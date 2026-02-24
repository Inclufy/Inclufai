import { AlertCircle, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageTranslations } from '@/hooks/usePageTranslations';

interface UpgradePromptProps {
  feature?: string;
  resourceType?: 'users' | 'programs' | 'projects';
  currentLimit?: number;
  currentUsage?: number;
  requiredTier?: string;
  onClose?: () => void;
  inline?: boolean;
}

const UpgradePrompt = ({
  feature,
  resourceType,
  currentLimit,
  currentUsage,
  requiredTier = 'Professional',
  onClose,
  inline = false
}: UpgradePromptProps) => {
  const { pt } = usePageTranslations();

  const getMessage = () => {
    if (resourceType && currentLimit !== undefined) {
      const limitText = currentLimit === -1 ? 'unlimited' : currentLimit;
      return pt(`You've reached your limit of ${limitText} ${resourceType}. Upgrade to add more.`);
    }

    if (feature) {
      return pt(`${feature} is not available in your current plan.`);
    }

    return pt('This feature is not available in your current plan.');
  };

  if (inline) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800">{getMessage()}</p>
          <p className="text-sm text-yellow-700 mt-1">
            {pt(`Upgrade to ${requiredTier} to unlock this feature.`)}
          </p>
        </div>
        <Button
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => window.location.href = '/profile?tab=subscription'}
        >
          <Crown className="w-4 h-4 mr-1" />
          {pt("Upgrade")}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader className="relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-purple-600" />
          <CardTitle>{pt("Upgrade Required")}</CardTitle>
        </div>
        <CardDescription>{getMessage()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{pt("Recommended Plan")}</span>
            <Badge className="bg-purple-100 text-purple-800">
              {requiredTier}
            </Badge>
          </div>
          {resourceType && currentLimit !== undefined && currentLimit !== -1 && (
            <div className="text-sm text-gray-600">
              {pt("Current:")} {currentUsage || 0} / {currentLimit} {resourceType}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={() => window.location.href = '/profile?tab=subscription'}
          >
            <Crown className="w-4 h-4 mr-2" />
            {pt("View Plans")}
          </Button>
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
            >
              {pt("Maybe Later")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
