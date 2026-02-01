import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserFeatures, hasFeature } from '@/hooks/useUserFeatures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FeatureGuardProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  redirect?: string;
  requiredTier?: string;
}

const FeatureGuard = ({ 
  feature, 
  children, 
  fallback,
  redirect,
  requiredTier = 'Professional'
}: FeatureGuardProps) => {
  const { data: userFeatures, isLoading } = useUserFeatures();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Check if user has feature access
  const hasAccess = hasFeature(userFeatures, feature);

  if (!hasAccess) {
    // Redirect if specified
    if (redirect) {
      return <Navigate to={redirect} replace />;
    }

    // Use custom fallback if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default upgrade page
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="border-2 border-purple-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">Feature Not Available</CardTitle>
            <p className="text-gray-600 mt-2">
              This feature is not included in your current plan.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">
                  Available in {requiredTier}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Upgrade your plan to unlock this feature and many more
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={() => window.location.href = '/profile?tab=subscription'}
              >
                <Crown className="w-4 h-4 mr-2" />
                View Plans
              </Button>
            </div>

            {userFeatures && (
              <div className="text-center text-sm text-gray-500">
                Current plan: <Badge className="ml-1">{userFeatures.tier}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access - render children
  return <>{children}</>;
};

export default FeatureGuard;
