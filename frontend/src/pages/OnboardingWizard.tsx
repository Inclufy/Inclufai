// src/pages/OnboardingWizard.tsx
// First-time onboarding wizard - Marketing AI style
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
  Building2,
  Search,
  Package,
  Users,
  Target,
  Palette,
  Swords,
  FolderOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Globe,
  Sparkles,
  Loader2,
  Rocket,
} from 'lucide-react';

// ============================================
// Types
// ============================================
interface OnboardingData {
  // Step 1: Bedrijf
  companyName: string;
  websiteUrl: string;
  industry: string;
  country: string;
  language: string;
  // Step 2: Scan
  scanUrl: string;
  scanComplete: boolean;
  // Step 3: Product
  productName: string;
  productDescription: string;
  productType: string;
  priceRange: string;
  // Step 4: Doelgroep
  targetAudience: string;
  ageRange: string;
  audienceSize: string;
  audienceInterests: string[];
  // Step 5: Doelen
  primaryGoal: string;
  secondaryGoals: string[];
  timeline: string;
  // Step 6: Merk
  brandTone: string;
  brandValues: string[];
  brandColors: string;
  // Step 7: Concurrentie
  competitors: string[];
  competitorUrl1: string;
  competitorUrl2: string;
  competitorUrl3: string;
  differentiator: string;
  // Step 8: Portfolio
  hasExistingContent: boolean;
  contentTypes: string[];
  socialChannels: string[];
}

// ============================================
// Translations
// ============================================
const translations = {
  nl: {
    steps: [
      { label: 'Bedrijf', shortLabel: 'Bedrijf' },
      { label: 'Scan', shortLabel: 'Scan' },
      { label: 'Product', shortLabel: 'Product' },
      { label: 'Doelgroep', shortLabel: 'Doelgroep' },
      { label: 'Doelen', shortLabel: 'Doelen' },
      { label: 'Merk', shortLabel: 'Merk' },
      { label: 'Concurrentie', shortLabel: 'Concurrentie' },
      { label: 'Portfolio', shortLabel: 'Portfolio' },
      { label: 'Klaar!', shortLabel: 'Klaar!' },
    ],
    step1: {
      title: 'Vertel ons over je bedrijf',
      subtitle: 'We gebruiken deze informatie om je marketing te personaliseren',
      companyName: 'Bedrijfsnaam',
      companyNamePlaceholder: 'bijv. Inclufy Marketing',
      websiteUrl: 'Website URL',
      websiteUrlPlaceholder: 'www.jouwbedrijf.nl',
      industry: 'Branche / Sector',
      country: 'Land',
      language: 'Taal',
    },
    step2: {
      title: 'Website Scan',
      subtitle: 'We analyseren je website om je marketingstrategie te optimaliseren',
      scanButton: 'Start Website Scan',
      scanning: 'Website wordt geanalyseerd...',
      scanComplete: 'Scan voltooid!',
      scanDescription: 'Voer je website URL in om een automatische analyse te starten. We bekijken je huidige content, SEO-prestaties en verbeterpunten.',
      skipScan: 'Sla scan over',
    },
    step3: {
      title: 'Vertel ons over je product',
      subtitle: 'Beschrijf je belangrijkste product of dienst',
      productName: 'Product / Dienst naam',
      productNamePlaceholder: 'bijv. Marketing Automatisering Platform',
      productDescription: 'Korte beschrijving',
      productDescriptionPlaceholder: 'Beschrijf wat je product of dienst doet...',
      productType: 'Type product',
      priceRange: 'Prijsklasse',
    },
    step4: {
      title: 'Wie is je doelgroep?',
      subtitle: 'Help ons begrijpen wie je klanten zijn',
      targetAudience: 'Doelgroep beschrijving',
      targetAudiencePlaceholder: 'bijv. MKB-eigenaren in de tech-sector',
      ageRange: 'Leeftijdscategorie',
      audienceSize: 'Geschatte doelgroep grootte',
      interests: 'Interesses',
    },
    step5: {
      title: 'Wat zijn je doelen?',
      subtitle: 'Kies je primaire marketingdoel',
      primaryGoal: 'Primair doel',
      secondaryGoals: 'Secundaire doelen',
      timeline: 'Tijdlijn',
    },
    step6: {
      title: 'Je merkidentiteit',
      subtitle: 'Definieer de stem en stijl van je merk',
      brandTone: 'Toon van communicatie',
      brandValues: 'Merkwaarden',
      brandColors: 'Merk kleuren',
      brandColorsPlaceholder: 'bijv. #7C3AED, #10B981',
    },
    step7: {
      title: 'Ken je concurrentie',
      subtitle: 'Wie zijn je belangrijkste concurrenten?',
      competitorUrl: 'Concurrent website',
      competitorPlaceholder: 'www.concurrent.nl',
      differentiator: 'Wat maakt jou uniek?',
      differentiatorPlaceholder: 'Beschrijf je unieke verkooppunten...',
    },
    step8: {
      title: 'Je content portfolio',
      subtitle: 'Welke content maak je al?',
      hasExisting: 'Heb je al bestaande marketing content?',
      contentTypes: 'Content types',
      socialChannels: 'Social media kanalen',
    },
    step9: {
      title: 'Je bent klaar!',
      subtitle: 'Je marketing AI is geconfigureerd en klaar om te starten',
      summary: 'Samenvatting',
      startButton: 'Start met Marketing AI',
      features: [
        'Gepersonaliseerde contentstrategieën',
        'AI-gegenereerde marketingteksten',
        'Concurrentie-analyse op maat',
        'SEO-optimalisatie voor jouw sector',
      ],
    },
    required: 'verplicht',
    next: 'Volgende',
    previous: 'Vorige',
    skip: 'Overslaan',
    stepOf: 'Stap {current} van {total}',
  },
  en: {
    steps: [
      { label: 'Company', shortLabel: 'Company' },
      { label: 'Scan', shortLabel: 'Scan' },
      { label: 'Product', shortLabel: 'Product' },
      { label: 'Audience', shortLabel: 'Audience' },
      { label: 'Goals', shortLabel: 'Goals' },
      { label: 'Brand', shortLabel: 'Brand' },
      { label: 'Competition', shortLabel: 'Competition' },
      { label: 'Portfolio', shortLabel: 'Portfolio' },
      { label: 'Done!', shortLabel: 'Done!' },
    ],
    step1: {
      title: 'Tell us about your company',
      subtitle: 'We use this information to personalize your marketing',
      companyName: 'Company Name',
      companyNamePlaceholder: 'e.g. Inclufy Marketing',
      websiteUrl: 'Website URL',
      websiteUrlPlaceholder: 'www.yourcompany.com',
      industry: 'Industry / Sector',
      country: 'Country',
      language: 'Language',
    },
    step2: {
      title: 'Website Scan',
      subtitle: 'We analyze your website to optimize your marketing strategy',
      scanButton: 'Start Website Scan',
      scanning: 'Analyzing website...',
      scanComplete: 'Scan complete!',
      scanDescription: 'Enter your website URL to start an automatic analysis. We review your current content, SEO performance, and improvement opportunities.',
      skipScan: 'Skip scan',
    },
    step3: {
      title: 'Tell us about your product',
      subtitle: 'Describe your main product or service',
      productName: 'Product / Service name',
      productNamePlaceholder: 'e.g. Marketing Automation Platform',
      productDescription: 'Short description',
      productDescriptionPlaceholder: 'Describe what your product or service does...',
      productType: 'Product type',
      priceRange: 'Price range',
    },
    step4: {
      title: 'Who is your target audience?',
      subtitle: 'Help us understand who your customers are',
      targetAudience: 'Target audience description',
      targetAudiencePlaceholder: 'e.g. SMB owners in the tech sector',
      ageRange: 'Age category',
      audienceSize: 'Estimated audience size',
      interests: 'Interests',
    },
    step5: {
      title: 'What are your goals?',
      subtitle: 'Choose your primary marketing goal',
      primaryGoal: 'Primary goal',
      secondaryGoals: 'Secondary goals',
      timeline: 'Timeline',
    },
    step6: {
      title: 'Your brand identity',
      subtitle: 'Define the voice and style of your brand',
      brandTone: 'Communication tone',
      brandValues: 'Brand values',
      brandColors: 'Brand colors',
      brandColorsPlaceholder: 'e.g. #7C3AED, #10B981',
    },
    step7: {
      title: 'Know your competition',
      subtitle: 'Who are your main competitors?',
      competitorUrl: 'Competitor website',
      competitorPlaceholder: 'www.competitor.com',
      differentiator: 'What makes you unique?',
      differentiatorPlaceholder: 'Describe your unique selling points...',
    },
    step8: {
      title: 'Your content portfolio',
      subtitle: 'What content are you already creating?',
      hasExisting: 'Do you already have existing marketing content?',
      contentTypes: 'Content types',
      socialChannels: 'Social media channels',
    },
    step9: {
      title: "You're all set!",
      subtitle: 'Your marketing AI is configured and ready to go',
      summary: 'Summary',
      startButton: 'Start with Marketing AI',
      features: [
        'Personalized content strategies',
        'AI-generated marketing copy',
        'Tailored competition analysis',
        'SEO optimization for your sector',
      ],
    },
    required: 'required',
    next: 'Next',
    previous: 'Previous',
    skip: 'Skip',
    stepOf: 'Step {current} of {total}',
  },
};

// ============================================
// Option data
// ============================================
const industries = [
  'E-commerce', 'SaaS / Technology', 'Consulting', 'Healthcare',
  'Education', 'Real Estate', 'Finance', 'Marketing / Agency',
  'Hospitality', 'Retail', 'Non-profit', 'Other',
];

const countries: Record<string, string[]> = {
  nl: ['Nederland', 'België', 'Duitsland', 'Verenigd Koninkrijk', 'Verenigde Staten', 'Frankrijk', 'Spanje', 'Anders'],
  en: ['Netherlands', 'Belgium', 'Germany', 'United Kingdom', 'United States', 'France', 'Spain', 'Other'],
};

const languageOptions: Record<string, string[]> = {
  nl: ['Nederlands', 'English', 'Deutsch', 'Français', 'Español'],
  en: ['Dutch', 'English', 'German', 'French', 'Spanish'],
};

const productTypes: Record<string, string[]> = {
  nl: ['SaaS / Software', 'Fysiek product', 'Dienstverlening', 'Consultancy', 'E-learning / Cursus', 'Abonnement', 'Marketplace', 'Anders'],
  en: ['SaaS / Software', 'Physical product', 'Service', 'Consultancy', 'E-learning / Course', 'Subscription', 'Marketplace', 'Other'],
};

const priceRanges: Record<string, string[]> = {
  nl: ['Gratis / Freemium', '€1 - €50', '€50 - €200', '€200 - €1.000', '€1.000 - €10.000', '€10.000+', 'Op maat'],
  en: ['Free / Freemium', '€1 - €50', '€50 - €200', '€200 - €1,000', '€1,000 - €10,000', '€10,000+', 'Custom'],
};

const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const audienceSizes: Record<string, string[]> = {
  nl: ['< 1.000', '1.000 - 10.000', '10.000 - 100.000', '100.000 - 1M', '1M+'],
  en: ['< 1,000', '1,000 - 10,000', '10,000 - 100,000', '100,000 - 1M', '1M+'],
};

const interestOptions: Record<string, string[]> = {
  nl: ['Technologie', 'Business', 'Gezondheid', 'Financiën', 'Onderwijs', 'Lifestyle', 'Sport', 'Reizen', 'Eten & Drinken', 'Mode'],
  en: ['Technology', 'Business', 'Health', 'Finance', 'Education', 'Lifestyle', 'Sports', 'Travel', 'Food & Drinks', 'Fashion'],
};

const goalOptions: Record<string, string[]> = {
  nl: ['Meer leads genereren', 'Meer verkoop', 'Merkbekendheid vergroten', 'Klantretentie verbeteren', 'Kosten verlagen', 'Nieuwe markten betreden', 'Content productie opschalen', 'Social media groei'],
  en: ['Generate more leads', 'Increase sales', 'Increase brand awareness', 'Improve customer retention', 'Reduce costs', 'Enter new markets', 'Scale content production', 'Social media growth'],
};

const timelineOptions: Record<string, string[]> = {
  nl: ['1-3 maanden', '3-6 maanden', '6-12 maanden', '12+ maanden'],
  en: ['1-3 months', '3-6 months', '6-12 months', '12+ months'],
};

const toneOptions: Record<string, string[]> = {
  nl: ['Professioneel', 'Informeel / Casual', 'Inspirerend', 'Educatief', 'Humoristisch', 'Luxe / Premium', 'Technisch', 'Empathisch'],
  en: ['Professional', 'Informal / Casual', 'Inspirational', 'Educational', 'Humorous', 'Luxury / Premium', 'Technical', 'Empathetic'],
};

const valueOptions: Record<string, string[]> = {
  nl: ['Innovatie', 'Betrouwbaarheid', 'Duurzaamheid', 'Kwaliteit', 'Toegankelijkheid', 'Transparantie', 'Creativiteit', 'Klantgerichtheid'],
  en: ['Innovation', 'Reliability', 'Sustainability', 'Quality', 'Accessibility', 'Transparency', 'Creativity', 'Customer focus'],
};

const contentTypeOptions: Record<string, string[]> = {
  nl: ['Blogartikelen', 'Social media posts', 'E-mail nieuwsbrieven', 'Video content', 'Podcasts', 'Whitepapers', 'Casestudies', 'Infographics'],
  en: ['Blog articles', 'Social media posts', 'Email newsletters', 'Video content', 'Podcasts', 'Whitepapers', 'Case studies', 'Infographics'],
};

const socialChannelOptions = ['LinkedIn', 'Instagram', 'Facebook', 'X / Twitter', 'TikTok', 'YouTube', 'Pinterest', 'Threads'];

// ============================================
// Step Icons
// ============================================
const stepIcons = [Building2, Search, Package, Users, Target, Palette, Swords, FolderOpen, CheckCircle2];

// ============================================
// Chip Selector Component
// ============================================
const ChipSelector = ({
  options,
  selected,
  onSelect,
  multi = false,
}: {
  options: string[];
  selected: string | string[];
  onSelect: (value: string | string[]) => void;
  multi?: boolean;
}) => {
  const handleClick = (option: string) => {
    if (multi) {
      const arr = selected as string[];
      if (arr.includes(option)) {
        onSelect(arr.filter((s) => s !== option));
      } else {
        onSelect([...arr, option]);
      }
    } else {
      onSelect(option);
    }
  };

  const isSelected = (option: string) =>
    multi ? (selected as string[]).includes(option) : selected === option;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleClick(option)}
          className={cn(
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border',
            isSelected(option)
              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

// ============================================
// Main Component
// ============================================
const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language === 'nl' ? 'nl' : 'en';
  const t = translations[lang];

  const [currentStep, setCurrentStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    companyName: '',
    websiteUrl: '',
    industry: '',
    country: lang === 'nl' ? 'Nederland' : 'Netherlands',
    language: lang === 'nl' ? 'Nederlands' : 'English',
    scanUrl: '',
    scanComplete: false,
    productName: '',
    productDescription: '',
    productType: '',
    priceRange: '',
    targetAudience: '',
    ageRange: '',
    audienceSize: '',
    audienceInterests: [],
    primaryGoal: '',
    secondaryGoals: [],
    timeline: '',
    brandTone: '',
    brandValues: [],
    brandColors: '',
    competitors: [],
    competitorUrl1: '',
    competitorUrl2: '',
    competitorUrl3: '',
    differentiator: '',
    hasExistingContent: false,
    contentTypes: [],
    socialChannels: [],
  });

  const totalSteps = 9;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_data', JSON.stringify(data));
    navigate('/dashboard');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_skipped', 'true');
    navigate('/dashboard');
  };

  const simulateScan = () => {
    if (!data.websiteUrl && !data.scanUrl) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      updateData('scanComplete', true);
    }, 3000);
  };

  const stepOfText = t.stepOf
    .replace('{current}', String(currentStep + 1))
    .replace('{total}', String(totalSteps));

  // ============================================
  // Stepper
  // ============================================
  const renderStepper = () => (
    <div className="flex items-center justify-between w-full max-w-5xl mx-auto px-4">
      {t.steps.map((step, index) => {
        const Icon = stepIcons[index];
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => index <= currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                  isActive
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : isCompleted
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-400'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </button>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  isActive ? 'text-white' : isCompleted ? 'text-purple-400' : 'text-slate-500'
                )}
              >
                {step.shortLabel}
              </span>
            </div>
            {index < t.steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2 mt-[-18px] rounded-full transition-all duration-300',
                  index < currentStep ? 'bg-purple-600/50' : 'bg-slate-700/50'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // ============================================
  // Step Content Renderers
  // ============================================
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {t.step1.companyName} <span className="text-purple-400">*</span>
        </label>
        <Input
          value={data.companyName}
          onChange={(e) => updateData('companyName', e.target.value)}
          placeholder={t.step1.companyNamePlaceholder}
          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {t.step1.websiteUrl}
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            value={data.websiteUrl}
            onChange={(e) => updateData('websiteUrl', e.target.value)}
            placeholder={t.step1.websiteUrlPlaceholder}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12 pl-10"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step1.industry}
        </label>
        <ChipSelector
          options={industries}
          selected={data.industry}
          onSelect={(v) => updateData('industry', v as string)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step1.country}
        </label>
        <ChipSelector
          options={countries[lang]}
          selected={data.country}
          onSelect={(v) => updateData('country', v as string)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step1.language}
        </label>
        <ChipSelector
          options={languageOptions[lang]}
          selected={data.language}
          onSelect={(v) => updateData('language', v as string)}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <p className="text-slate-400">{t.step2.scanDescription}</p>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">URL</label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            value={data.scanUrl || data.websiteUrl}
            onChange={(e) => updateData('scanUrl', e.target.value)}
            placeholder="www.jouwbedrijf.nl"
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12 pl-10"
          />
        </div>
      </div>

      {!data.scanComplete ? (
        <div className="flex flex-col items-center gap-4 py-8">
          {isScanning ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              </div>
              <p className="text-slate-300 font-medium">{t.step2.scanning}</p>
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          ) : (
            <Button
              onClick={simulateScan}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 px-8 gap-2"
            >
              <Search className="w-5 h-5" />
              {t.step2.scanButton}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-emerald-400 font-semibold text-lg">{t.step2.scanComplete}</p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {t.step3.productName} <span className="text-purple-400">*</span>
        </label>
        <Input
          value={data.productName}
          onChange={(e) => updateData('productName', e.target.value)}
          placeholder={t.step3.productNamePlaceholder}
          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {t.step3.productDescription}
        </label>
        <textarea
          value={data.productDescription}
          onChange={(e) => updateData('productDescription', e.target.value)}
          placeholder={t.step3.productDescriptionPlaceholder}
          rows={3}
          className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step3.productType}
        </label>
        <ChipSelector
          options={productTypes[lang]}
          selected={data.productType}
          onSelect={(v) => updateData('productType', v as string)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step3.priceRange}
        </label>
        <ChipSelector
          options={priceRanges[lang]}
          selected={data.priceRange}
          onSelect={(v) => updateData('priceRange', v as string)}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {t.step4.targetAudience}
        </label>
        <Input
          value={data.targetAudience}
          onChange={(e) => updateData('targetAudience', e.target.value)}
          placeholder={t.step4.targetAudiencePlaceholder}
          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step4.ageRange}
        </label>
        <ChipSelector
          options={ageRanges}
          selected={data.ageRange}
          onSelect={(v) => updateData('ageRange', v as string)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step4.audienceSize}
        </label>
        <ChipSelector
          options={audienceSizes[lang]}
          selected={data.audienceSize}
          onSelect={(v) => updateData('audienceSize', v as string)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step4.interests}
        </label>
        <ChipSelector
          options={interestOptions[lang]}
          selected={data.audienceInterests}
          onSelect={(v) => updateData('audienceInterests', v as string[])}
          multi
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step5.primaryGoal} <span className="text-purple-400">*</span>
        </label>
        <ChipSelector
          options={goalOptions[lang]}
          selected={data.primaryGoal}
          onSelect={(v) => updateData('primaryGoal', v as string)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step5.secondaryGoals}
        </label>
        <ChipSelector
          options={goalOptions[lang].filter((g) => g !== data.primaryGoal)}
          selected={data.secondaryGoals}
          onSelect={(v) => updateData('secondaryGoals', v as string[])}
          multi
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step5.timeline}
        </label>
        <ChipSelector
          options={timelineOptions[lang]}
          selected={data.timeline}
          onSelect={(v) => updateData('timeline', v as string)}
        />
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step6.brandTone}
        </label>
        <ChipSelector
          options={toneOptions[lang]}
          selected={data.brandTone}
          onSelect={(v) => updateData('brandTone', v as string)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step6.brandValues}
        </label>
        <ChipSelector
          options={valueOptions[lang]}
          selected={data.brandValues}
          onSelect={(v) => updateData('brandValues', v as string[])}
          multi
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {t.step6.brandColors}
        </label>
        <Input
          value={data.brandColors}
          onChange={(e) => updateData('brandColors', e.target.value)}
          placeholder={t.step6.brandColorsPlaceholder}
          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12"
        />
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            {t.step7.competitorUrl} {i}
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              value={data[`competitorUrl${i}` as keyof OnboardingData] as string}
              onChange={(e) => updateData(`competitorUrl${i}` as keyof OnboardingData, e.target.value)}
              placeholder={t.step7.competitorPlaceholder}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-12 pl-10"
            />
          </div>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          {t.step7.differentiator}
        </label>
        <textarea
          value={data.differentiator}
          onChange={(e) => updateData('differentiator', e.target.value)}
          placeholder={t.step7.differentiatorPlaceholder}
          rows={3}
          className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step8.hasExisting}
        </label>
        <div className="flex gap-3">
          {[
            { label: lang === 'nl' ? 'Ja' : 'Yes', value: true },
            { label: lang === 'nl' ? 'Nee' : 'No', value: false },
          ].map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => updateData('hasExistingContent', option.value)}
              className={cn(
                'px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border',
                data.hasExistingContent === option.value
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step8.contentTypes}
        </label>
        <ChipSelector
          options={contentTypeOptions[lang]}
          selected={data.contentTypes}
          onSelect={(v) => updateData('contentTypes', v as string[])}
          multi
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {t.step8.socialChannels}
        </label>
        <ChipSelector
          options={socialChannelOptions}
          selected={data.socialChannels}
          onSelect={(v) => updateData('socialChannels', v as string[])}
          multi
        />
      </div>
    </div>
  );

  const renderStep9 = () => (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-xl shadow-purple-500/30">
          <Rocket className="w-12 h-12 text-white" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.companyName && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{t.steps[0].label}</span>
            </div>
            <p className="text-white font-semibold">{data.companyName}</p>
            {data.industry && <p className="text-slate-400 text-sm">{data.industry}</p>}
          </div>
        )}
        {data.productName && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{t.steps[2].label}</span>
            </div>
            <p className="text-white font-semibold">{data.productName}</p>
            {data.productType && <p className="text-slate-400 text-sm">{data.productType}</p>}
          </div>
        )}
        {data.primaryGoal && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{t.steps[4].label}</span>
            </div>
            <p className="text-white font-semibold">{data.primaryGoal}</p>
            {data.timeline && <p className="text-slate-400 text-sm">{data.timeline}</p>}
          </div>
        )}
        {data.brandTone && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">{t.steps[5].label}</span>
            </div>
            <p className="text-white font-semibold">{data.brandTone}</p>
            {data.brandValues.length > 0 && (
              <p className="text-slate-400 text-sm">{data.brandValues.join(', ')}</p>
            )}
          </div>
        )}
      </div>

      {/* Features list */}
      <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-white font-semibold">
            {lang === 'nl' ? 'Wat je kunt verwachten' : 'What to expect'}
          </span>
        </div>
        <ul className="space-y-3">
          {t.step9.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={handleComplete}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl h-14 text-lg font-semibold gap-3 shadow-xl shadow-purple-500/25"
      >
        <Rocket className="w-5 h-5" />
        {t.step9.startButton}
      </Button>
    </div>
  );

  const stepRenderers = [
    renderStep1, renderStep2, renderStep3, renderStep4,
    renderStep5, renderStep6, renderStep7, renderStep8, renderStep9,
  ];

  const stepTitles = [
    t.step1, t.step2, t.step3, t.step4,
    t.step5, t.step6, t.step7, t.step8, t.step9,
  ];

  const currentStepData = stepTitles[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">Inclufy.</span>
              <span className="text-xs block text-purple-400 font-semibold -mt-0.5 tracking-wider uppercase">
                Marketing AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{stepOfText}</span>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-slate-400 hover:text-white text-sm"
            >
              {t.skip}
            </Button>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="border-b border-slate-800 bg-slate-900/50 py-4">
        {renderStepper()}
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            {(() => {
              const Icon = stepIcons[currentStep];
              return <Icon className="w-8 h-8 text-purple-400" />;
            })()}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {currentStepData.title}
          </h1>
          <p className="text-slate-400">{currentStepData.subtitle}</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          {stepRenderers[currentStep]()}
        </div>

        {/* Navigation */}
        {!isLastStep && (
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="ghost"
              className="text-slate-400 hover:text-white gap-2 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.previous}
            </Button>
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-8 gap-2"
            >
              {t.next}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OnboardingWizard;
