import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Calendar, Crown, Zap, Users, Building, ArrowUpRight, Loader2 } from 'lucide-react';
import { formatBudget, getCurrencyFromLanguage } from '@/lib/currencies';
import { usePageTranslations } from '@/hooks/usePageTranslations';

interface PlanFeature {
  included: boolean;
  text: string;
}

// Updated to match actual backend structure
interface BackendPlan {
  id: number;
  name: string;
  plan_type: string;  // "monthly" or "yearly"
  plan_level: string;  // "basic", "starter", "premium", "business"
  price: string;  // String like "29.00"
  stripe_price_id: string;
  max_users: number | null;
  max_projects: number | null;
  storage_limit_gb: number | null;
  features: string[];  // Array of feature strings!
  is_active: boolean;
  is_popular: boolean;
  priority_support: boolean;
  advanced_analytics: boolean;
  custom_integrations: boolean;
}

interface DisplayPlan {
  id: number;
  tier: string;
  name: string;
  price: number;
  features: PlanFeature[];
  popular?: boolean;
  icon: any;
  disabled?: boolean;
}

const SubscriptionTab = () => {
  const { pt } = usePageTranslations();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const currencyCode = getCurrencyFromLanguage(language);
  
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  const subscription = user?.subscription || {};
  const tier = subscription.tier || 'trial';
  const status = subscription.status || 'pending';
  const daysRemaining = subscription.days_remaining;
  const isTrial = tier === 'trial';
  
  const tierNames: Record<string, string> = {
    trial: 'Trial',
    starter: 'Starter',
    professional: 'Professional',
    team: 'Team',
    enterprise: 'Enterprise'
  };

  // Icon mapping
  const tierIcons: Record<string, any> = {
    basic: Zap,
    starter: Zap,
    premium: Crown,
    business: Users,
    enterprise: Building,
  };

  // Fetch plans from Admin Portal
  const { data: plansData, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/v1/admin/plans/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        console.error('Failed to fetch plans:', response.status);
        throw new Error('Failed to fetch plans');
      }
      const data = await response.json();
      console.log('✅ Fetched plans from Admin Portal:', data);
      return data;
    },
  });

  // Transform backend plans to display format
  const plans: DisplayPlan[] = (plansData?.results || plansData || [])
    .filter((p: BackendPlan) => 
      p.is_active && 
      p.plan_level !== 'basic' && // Skip trial
      p.plan_type === 'monthly' // Only show monthly for now
    )
    .map((p: BackendPlan) => {
      const planLevel = p.plan_level?.toLowerCase() || 'starter';
      
      // Build features list from backend structure
      const features: PlanFeature[] = [];
      
      // Projects - Handle null as unlimited
      const maxProjects = p.max_projects;
      if (maxProjects === null || maxProjects === 0 || maxProjects === -1) {
        features.push({ included: true, text: pt('Unlimited Projects') });
      } else {
        features.push({ included: true, text: `${maxProjects} ${pt('Projects')}` });
      }
      
      // Users - Handle null as unlimited
      const maxUsers = p.max_users;
      if (maxUsers === null || maxUsers === 0 || maxUsers === -1) {
        features.push({ included: true, text: pt('Unlimited Users') });
      } else if (maxUsers === 1) {
        features.push({ included: true, text: `1 ${pt('User')}` });
      } else {
        features.push({ included: true, text: `${pt('Up to')} ${maxUsers} ${pt('Users')}` });
      }
      
      // Parse features from string array
      const featureList = p.features || [];
      const hasFeature = (keyword: string) => 
        featureList.some((f: string) => f.toLowerCase().includes(keyword.toLowerCase()));
      
      // Add boolean features
      if (hasFeature('tijdregistratie') || hasFeature('time')) {
        features.push({ included: true, text: pt('Time Tracking') });
      }
      if (hasFeature('ai')) {
        features.push({ included: true, text: pt('AI Assistant') });
      }
      if (hasFeature('programma') || hasFeature('program')) {
        features.push({ included: true, text: pt('Program Management') });
      }
      if (hasFeature('team') || hasFeature('collaboration')) {
        features.push({ included: true, text: pt('Team Collaboration') });
      }
      if (p.priority_support) {
        features.push({ included: true, text: pt('Priority Support') });
      }
      if (p.advanced_analytics) {
        features.push({ included: true, text: pt('Advanced Analytics') });
      }
      if (hasFeature('gantt')) {
        features.push({ included: true, text: pt('Gantt Charts') });
      }

      // Add negative features for lower tiers
      if (planLevel === 'starter') {
        features.push({ included: false, text: pt('Advanced Analytics') });
        features.push({ included: false, text: pt('Team Features') });
        features.push({ included: false, text: pt('Program Management') });
      }
      
      return {
        id: p.id,
        tier: planLevel,
        name: p.name,
        price: parseFloat(p.price) || 0,
        features,
        popular: p.is_popular,
        icon: tierIcons[planLevel] || Crown,
        disabled: tier.toLowerCase() === planLevel
      };
    })
    .sort((a: DisplayPlan, b: DisplayPlan) => a.price - b.price);

  // Check for success/cancel params
  useEffect(() => {
    const success = searchParams.get('success');
    const cancelled = searchParams.get('cancelled');
    const upgradeCompleted = searchParams.get('tier');

    if (success === 'true' && upgradeCompleted) {
      setAlert({
        type: 'success',
        message: `Successfully upgraded to ${upgradeCompleted}! Your subscription is now active.`
      });
      setTimeout(() => {
        window.history.replaceState({}, '', '/profile?tab=subscription');
      }, 100);
    } else if (cancelled === 'true') {
      setAlert({
        type: 'info',
        message: 'Checkout cancelled. You can upgrade anytime.'
      });
      setTimeout(() => {
        window.history.replaceState({}, '', '/profile?tab=subscription');
      }, 100);
    }
  }, [searchParams]);

  const handleUpgrade = async (planId: number, planTier: string) => {
    setIsUpgrading(true);
    setAlert(null);
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log(`🚀 Starting upgrade to plan ID ${planId} (${planTier})...`);
      
      // Create Stripe checkout session
      const checkoutResponse = await fetch('/api/v1/subscriptions/create-checkout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan_id: planId,
          success_url: `${window.location.origin}/profile?tab=subscription&success=true&tier=${planTier}`,
          cancel_url: `${window.location.origin}/profile?tab=subscription&cancelled=true`
        })
      });
      
      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json().catch(() => ({}));
        console.error('❌ Checkout error:', errorData);
        throw new Error(errorData.error || errorData.detail || 'Failed to create checkout session');
      }
      
      const checkoutData = await checkoutResponse.json();
      console.log('✅ Checkout session created:', checkoutData);
      
      // Redirect to Stripe
      if (checkoutData.checkout_url) {
        console.log('🔄 Redirecting to Stripe checkout...');
        window.location.href = checkoutData.checkout_url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
      
    } catch (error) {
      console.error('❌ Upgrade failed:', error);
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to start checkout. Please try again.'
      });
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <Alert 
          variant={alert.type === 'error' ? 'destructive' : 'default'}
          className={
            alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
            alert.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
            ''
          }
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Current Plan Card */}
      <Card className="border-0 ring-1 ring-purple-100 dark:ring-purple-900/50 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10 shadow-xl">
        <CardHeader className="border-b border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {pt("Current Plan")}
            </CardTitle>
            <Badge 
              variant={status === 'active' ? 'default' : 'secondary'}
              className="text-sm px-3 py-1"
            >
              {status === 'active' ? `✓ ${pt("Active")}` : status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {tierNames[tier as keyof typeof tierNames]}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isTrial ? pt('Limited trial features') : pt('Full access to all features')}
                </p>
              </div>
              
              {daysRemaining !== null && daysRemaining !== undefined && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  daysRemaining > 7 
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    {daysRemaining > 0 ? `${daysRemaining} ${pt("days left")}` : pt('Expired')}
                  </span>
                </div>
              )}
            </div>

            {/* Trial Warning */}
            {isTrial && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-1">
                      {pt("Limited Trial Features")}
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      {pt("Upgrade to unlock unlimited projects, advanced features, and team collaboration")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans - Show for trial and lower tiers */}
      {(isTrial || tier === 'starter') && (
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {pt("Upgrade Your Plan")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {pt("Choose the perfect plan for your needs")}
            </p>
          </div>

          {plansLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">{pt("Loading plans...")}</span>
            </div>
          ) : plansError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {pt("Failed to load plans. Please refresh the page or contact support.")}
              </AlertDescription>
            </Alert>
          ) : plans.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{pt("No plans available at the moment. Please contact support.")}</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map(plan => {
                const IconComponent = plan.icon;
                return (
                  <Card 
                    key={plan.id}
                    className={`relative border-0 ring-1 ${
                      plan.popular 
                        ? 'ring-purple-300 dark:ring-purple-700 shadow-xl shadow-purple-500/20' 
                        : 'ring-purple-100 dark:ring-purple-900/50'
                    } hover:ring-purple-300 dark:hover:ring-purple-700 transition-all duration-300 ${
                      plan.disabled ? 'opacity-60' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 shadow-lg">
                          {pt("Most Popular")}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">{formatBudget(plan.price, currencyCode)}</span>
                        <span className="text-gray-500 dark:text-gray-400">/{pt("month")}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            {feature.included ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={`text-sm ${
                              feature.included 
                                ? 'text-gray-700 dark:text-gray-300' 
                                : 'text-gray-400 dark:text-gray-600'
                            }`}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        className={`w-full font-bold rounded-xl ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ring-2 ring-inset ring-purple-200 dark:ring-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        }`}
                        onClick={() => handleUpgrade(plan.id, plan.tier)}
                        disabled={plan.disabled || isUpgrading}
                      >
                        {isUpgrading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {pt("Processing...")}
                          </>
                        ) : plan.disabled ? (
                          pt('Current Plan')
                        ) : (
                          <>
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            {pt("Upgrade to")} {plan.name}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Payment & Billing - Only for paid users */}
      {!isTrial && (
        <>
          <Card className="border-0 ring-1 ring-purple-100 dark:ring-purple-900/50">
            <CardHeader>
              <CardTitle>{pt("Payment Method")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {pt("Manage your payment method and billing details")}
              </p>
              <Button variant="outline" className="font-bold">
                {pt("Update Payment Method")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 ring-1 ring-purple-100 dark:ring-purple-900/50">
            <CardHeader>
              <CardTitle>{pt("Billing History")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {pt("View your past invoices and payment history")}
              </p>
              <Button variant="outline" className="font-bold">
                {pt("View Invoices")}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 ring-1 ring-red-100 dark:ring-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">{pt("Cancel Subscription")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {pt("Cancel your subscription. You will retain access until the end of your billing period.")}
              </p>
              <Button variant="destructive" className="font-bold">
                {pt("Cancel Subscription")}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SubscriptionTab;