import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Mail, ArrowLeft } from 'lucide-react';

const TrialPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Aanvraag Ontvangen!</CardTitle>
          <CardDescription className="text-base">
            Bedankt voor je interesse in ProjeXtPal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  Je aanvraag wordt beoordeeld
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Ons team bekijkt je aanmelding en neemt binnen 24 uur contact met je op.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Wat gebeurt er nu?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span>We controleren je aanvraag</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span>Je ontvangt een e-mail met toegang tot je 14-dagen trial</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span>Je kunt direct aan de slag met alle functies</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm">
            <p className="text-muted-foreground">
              <strong>Let op:</strong> Check ook je spam folder voor onze e-mail. 
              Heb je na 24 uur nog niets ontvangen? Neem contact met ons op via{' '}
              <a href="mailto:support@projextpal.com" className="text-purple-600 hover:text-purple-700 underline">
                support@projextpal.com
              </a>
            </p>
          </div>

          <Button 
            onClick={() => navigate('/')}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialPending;
