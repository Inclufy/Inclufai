import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Calendar, 
  Video, 
  Mail, 
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react';

type Intent = '14_day_trial' | 'demo' | 'become_customer' | 'more_info' | 'contact_sales';

interface ConfirmationContent {
  icon: any;
  title: string;
  titleNL: string;
  message: string;
  messageNL: string;
  action: string;
  actionNL: string;
  actionUrl: string;
  color: string;
}

const confirmationContent: Record<Intent, ConfirmationContent> = {
  '14_day_trial': {
    icon: Calendar,
    title: 'Your 14-Day Trial is Active!',
    titleNL: 'Uw 14-Dagen Trial is Actief!',
    message: 'Congratulations! Your trial account has been created. You now have full access to all ProjeXtPal features for the next 14 days. Check your email for login credentials and getting started guide.',
    messageNL: 'Gefeliciteerd! Uw trial account is aangemaakt. U heeft nu volledige toegang tot alle ProjeXtPal functies voor de komende 14 dagen. Controleer uw e-mail voor inloggegevens en een handleiding om te starten.',
    action: 'Go to Dashboard',
    actionNL: 'Naar Dashboard',
    actionUrl: '/dashboard',
    color: 'from-purple-500 to-pink-500',
  },
  'demo': {
    icon: Video,
    title: 'Demo Request Received!',
    titleNL: 'Demo Aanvraag Ontvangen!',
    message: 'Thank you for your interest! One of our product specialists will contact you within 24 hours to schedule a personalized demo at your convenience.',
    messageNL: 'Bedankt voor uw interesse! Een van onze productspecialisten neemt binnen 24 uur contact met u op om een persoonlijke demo in te plannen op een moment dat u uitkomt.',
    action: 'Return to Home',
    actionNL: 'Terug naar Home',
    actionUrl: '/landing',
    color: 'from-blue-500 to-cyan-500',
  },
  'become_customer': {
    icon: CheckCircle2,
    title: 'Welcome Aboard!',
    titleNL: 'Welkom aan Boord!',
    message: 'Excellent choice! Our team will contact you shortly to discuss subscription options and help you get started with ProjeXtPal. Check your email for next steps.',
    messageNL: 'Uitstekende keuze! Ons team neemt spoedig contact met u op om abonnementsopties te bespreken en u te helpen starten met ProjeXtPal. Controleer uw e-mail voor de volgende stappen.',
    action: 'View Pricing',
    actionNL: 'Bekijk Prijzen',
    actionUrl: '/landing#pricing',
    color: 'from-green-500 to-emerald-500',
  },
  'more_info': {
    icon: Mail,
    title: 'Information Package Sent!',
    titleNL: 'Informatiepakket Verzonden!',
    message: 'We\'ve sent detailed information about ProjeXtPal to your email. You\'ll receive product documentation, pricing details, and customer success stories within the next few minutes.',
    messageNL: 'We hebben gedetailleerde informatie over ProjeXtPal naar uw e-mail gestuurd. U ontvangt binnen enkele minuten productdocumentatie, prijsdetails en succesverhalen van klanten.',
    action: 'Explore Features',
    actionNL: 'Verken Functies',
    actionUrl: '/landing#features',
    color: 'from-amber-500 to-orange-500',
  },
  'contact_sales': {
    icon: Phone,
    title: 'Sales Team Notified!',
    titleNL: 'Sales Team Geïnformeerd!',
    message: 'Thank you for reaching out! One of our sales representatives will contact you within the next business day to discuss enterprise solutions tailored to your organization\'s needs.',
    messageNL: 'Bedankt voor uw bericht! Een van onze sales medewerkers neemt binnen de volgende werkdag contact met u op om enterprise oplossingen te bespreken die zijn afgestemd op de behoeften van uw organisatie.',
    action: 'Contact Information',
    actionNL: 'Contact Informatie',
    actionUrl: '/landing#contact',
    color: 'from-indigo-500 to-purple-500',
  },
};

const RegistrationConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const intent = location.state?.intent as Intent;
  const userData = location.state?.userData || {};
  const isNL = location.state?.language === 'nl';

  // Redirect if no intent provided
  useEffect(() => {
    if (!intent) {
      navigate('/login');
    }
  }, [intent, navigate]);

  if (!intent) return null;

  const content = confirmationContent[intent];
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/20 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full shadow-2xl border-0 ring-1 ring-purple-100 dark:ring-purple-900/50">
        <CardHeader className="text-center pb-6 border-b border-purple-100">
          {/* Success Icon */}
          <div className={`mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br ${content.color} flex items-center justify-center shadow-lg animate-pulse`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          
          {/* Success Checkmark */}
          <div className="mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>

          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {isNL ? content.titleNL : content.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {isNL ? content.messageNL : content.message}
            </p>
          </div>

          {/* User Info Summary */}
          {userData.email && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {isNL ? 'Bevestigingsmail verzonden naar:' : 'Confirmation email sent to:'}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(content.actionUrl)}
              size="lg"
              className={`px-8 bg-gradient-to-r ${content.color} text-white shadow-lg hover:shadow-xl transition-all`}
            >
              {isNL ? content.actionNL : content.action}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="lg"
              className="px-8"
            >
              {isNL ? 'Naar Login' : 'Go to Login'}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              {isNL 
                ? 'Heeft u vragen? Neem contact op via support@projextpal.com' 
                : 'Have questions? Contact us at support@projextpal.com'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationConfirmation;
