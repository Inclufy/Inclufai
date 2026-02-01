import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import {
  Check,
  X,
  Star,
  Zap,
  Shield,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Home,
  ArrowLeft,
  Crown,
  TrendingUp,
  Loader2,
  GraduationCap,
  BookOpen,
  Video,
  Award,
} from "lucide-react";

const BRAND = {
  purple: '#8B5CF6',
  pink: '#D946EF',
  green: '#22C55E',
  blue: '#3B82F6',
  amber: '#F59E0B',
  orange: '#EA580C',
};

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  tagline: string;
  price: number | null;
  period: string;
  description: string;
  features: PlanFeature[];
  icon: any;
  gradient: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Starter',
    tagline: 'Mobile Only',
    price: 29,
    period: '/maand',
    description: 'Perfect voor individuen',
    icon: Zap,
    gradient: 'from-purple-600 via-purple-500 to-indigo-600',
    features: [
      { text: '📱 Mobile app toegang', included: true },
      { text: '1 gebruiker', included: true },
      { text: '5 projecten', included: true },
      { text: 'Tijdregistratie', included: true },
      { text: 'Basis AI assistent', included: true },
      { text: 'Web toegang', included: false },
      { text: 'Team features', included: false },
    ],
  },
  {
    name: 'Professional',
    tagline: 'Meest Gekozen',
    price: 49,
    period: '/maand',
    description: 'Voor serieuze project managers',
    icon: Crown,
    gradient: 'from-blue-600 via-blue-500 to-cyan-600',
    popular: true,
    features: [
      { text: '💻 Web + Mobile toegang', included: true },
      { text: '1 gebruiker', included: true },
      { text: '10 projecten', included: true },
      { text: 'Alles van Starter', included: true },
      { text: 'Programmamanagement', included: true },
      { text: 'Gantt charts & planning', included: true },
      { text: 'Geavanceerde AI', included: true },
      { text: 'Prioriteit support', included: true },
    ],
  },
  {
    name: 'Team',
    tagline: 'Voor Teams',
    price: 39,
    period: '/gebruiker/maand',
    description: 'Samenwerken met je team',
    icon: Users,
    gradient: 'from-pink-600 via-pink-500 to-rose-600',
    features: [
      { text: '💻 Web + Mobile toegang', included: true },
      { text: 'Tot 25 gebruikers', included: true },
      { text: 'Onbeperkte projecten', included: true },
      { text: 'Alles van Professional', included: true },
      { text: 'Team collaboration', included: true },
      { text: 'Gedeelde dashboards', included: true },
      { text: 'Admin permissies', included: true },
      { text: 'Portfolio management', included: true },
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'Op Maat',
    price: null,
    period: 'Custom',
    description: 'Volledige controle',
    icon: Building2,
    gradient: 'from-green-600 via-green-500 to-emerald-600',
    features: [
      { text: '🏢 Alles + White-label', included: true },
      { text: 'Onbeperkte gebruikers', included: true },
      { text: 'Onbeperkte projecten', included: true },
      { text: 'SSO/SAML integratie', included: true },
      { text: 'API toegang', included: true },
      { text: 'Custom workflows', included: true },
      { text: 'Dedicated manager', included: true },
      { text: 'SLA garantie', included: true },
    ],
  },
];

const PricingCard = ({ plan, isAnnual }: { plan: Plan; isAnnual: boolean }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const discountedPrice = plan.price ? Math.round(plan.price * 0.9) : null;
  const displayPrice = isAnnual && discountedPrice ? discountedPrice : plan.price;

  const handleCTAClick = async () => {
    if (!plan.price) {
      window.location.href = 'mailto:info@projextpal.com?subject=Enterprise Offerte Aanvraag';
      return;
    }

    if (!user) {
      navigate(`/login?redirect=checkout&plan=${plan.name.toLowerCase()}&billing=${isAnnual ? 'yearly' : 'monthly'}`);
      return;
    }

    navigate(`/checkout?plan=${plan.name.toLowerCase()}&billing=${isAnnual ? 'yearly' : 'monthly'}`);
  };

  return (
    <div className={`relative group ${plan.popular ? 'scale-105' : ''}`}>
      {plan.popular && (
        <div 
          className="absolute -inset-1 bg-gradient-to-r opacity-75 blur-2xl group-hover:opacity-100 transition-opacity rounded-3xl"
          style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.pink})` }}
        />
      )}

      <div 
        className={`relative bg-card/95 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
          plan.popular ? 'border-primary/50 shadow-2xl' : 'border-border/50 hover:border-primary/30'
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div 
              className="px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.pink})` }}
            >
              <Star className="w-4 h-4 fill-white" />
              {plan.tagline}
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <div 
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mx-auto shadow-xl transform group-hover:scale-110 transition-transform duration-300`}
          >
            <plan.icon className="w-10 h-10 text-white" />
          </div>
          <div className={`absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${plan.gradient} mx-auto blur-xl opacity-50`} />
        </div>

        <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-center text-sm mb-6">{plan.description}</p>

        <div className="text-center mb-8">
          {plan.price ? (
            <>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold tracking-tight">€{displayPrice}</span>
                <span className="text-muted-foreground text-lg">{plan.period}</span>
              </div>
              {isAnnual && discountedPrice && (
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                    💰 Bespaar €{(plan.price - discountedPrice) * 12}/jaar
                  </Badge>
                </div>
              )}
            </>
          ) : (
            <div className="text-5xl font-bold">Custom</div>
          )}
        </div>

        <div className="space-y-4 mb-8 min-h-[300px]">
          {plan.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                feature.included ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
              }`}>
                {feature.included ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" />}
              </div>
              <span className={`text-sm ${feature.included ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <Button 
          className="w-full h-14 rounded-xl font-bold text-base"
          variant={plan.popular ? 'default' : 'outline'}
          onClick={handleCTAClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Bezig...
            </>
          ) : plan.price ? (
            user ? (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Selecteer Plan
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Start Nu
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )
          ) : (
            <>
              Vraag Offerte Aan
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const Pricing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [earlyAccessEmail, setEarlyAccessEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEarlyAccessSignup = () => {
    if (!earlyAccessEmail || !earlyAccessEmail.includes('@')) {
      alert('Voer een geldig emailadres in');
      return;
    }
    setEmailSubmitted(true);
    setEarlyAccessEmail('');
    setTimeout(() => setEmailSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Terug
            </Button>
            <div className="h-6 w-px bg-border" />
            <h2 className="font-bold text-xl">Proje<span style={{ color: BRAND.purple }}>X</span>tPal</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button size="sm" onClick={() => navigate('/login')} style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.pink})`, color: 'white' }}>
              <Sparkles className="w-4 h-4 mr-2" />
              Aan de Slag
            </Button>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border backdrop-blur-xl" style={{ backgroundColor: `${BRAND.purple}10`, color: BRAND.purple, borderColor: `${BRAND.purple}20` }}>
              <Sparkles className="w-4 h-4" />
              💎 Transparante Prijzen
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Beheer Projecten <br className="hidden md:block" />
              <span style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.pink})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Met AI
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12">
              AI-powered projectmanagement met slimme tijdregistratie.
            </p>

            <div className="inline-flex items-center gap-1 p-1.5 bg-muted/50 backdrop-blur-xl rounded-full border border-border/50">
              <button onClick={() => setIsAnnual(false)} className={`px-8 py-3 rounded-full font-semibold transition-all ${!isAnnual ? 'bg-background shadow-lg' : 'text-muted-foreground'}`}>
                Maandelijks
              </button>
              <button onClick={() => setIsAnnual(true)} className={`px-8 py-3 rounded-full font-semibold transition-all relative ${isAnnual ? 'bg-background shadow-lg' : 'text-muted-foreground'}`}>
                Jaarlijks
                <Badge className="absolute -top-3 -right-3 text-xs font-bold shadow-lg animate-bounce" style={{ backgroundColor: BRAND.green, color: 'white' }}>-10%</Badge>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, i) => (<PricingCard key={i} plan={plan} isAnnual={isAnnual} />))}
          </div>

          <div className="max-w-7xl mx-auto mt-16">
            <Card className="relative overflow-hidden border-2">
              <CardContent className="relative p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <Badge className="text-base px-5 py-2 font-bold animate-pulse" style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.pink})`, color: 'white' }}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Badge>
                    <div>
                      <h2 className="text-4xl font-bold mb-3">
                        <span style={{ background: `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.orange})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          ProjeXtPal Academy
                        </span>
                      </h2>
                      <p className="text-xl text-muted-foreground">Leer projectmanagement van experts</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: BookOpen, title: 'Online Cursussen', desc: 'PRINCE2, Agile, Scrum certificeringen' },
                        { icon: Video, title: 'Video Tutorials', desc: 'Stap-voor-stap uitleg' },
                        { icon: Users, title: 'Live Webinars', desc: 'Interactieve sessies' },
                        { icon: Award, title: 'Certificaten', desc: 'Erkende certificaten' },
                      ].map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <f.icon className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{f.title}</p>
                            <p className="text-sm text-muted-foreground">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Input 
                        type="email" 
                        placeholder="jouw@email.com"
                        value={earlyAccessEmail}
                        onChange={(e) => setEarlyAccessEmail(e.target.value)}
                        disabled={emailSubmitted}
                        className="h-12"
                      />
                      <Button onClick={handleEarlyAccessSignup} disabled={emailSubmitted} className="h-12 px-6 font-bold" style={{ background: emailSubmitted ? `linear-gradient(135deg, ${BRAND.green}, #10B981)` : `linear-gradient(135deg, ${BRAND.amber}, ${BRAND.orange})`, color: 'white' }}>
                        {emailSubmitted ? <><Check className="w-4 h-4 mr-2" />Geregistreerd!</> : 'Notify Me'}
                      </Button>
                    </div>
                  </div>
                  <div className="relative aspect-square max-w-md mx-auto">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
