// ============================================
// src/utils/markdownRenderer.tsx
// Premium Academy Content Renderer — Luxe Icon Design
// ============================================

import React, { useState } from "react";
import {
  Lightbulb, AlertTriangle, Pin, Target, BarChart3,
  CheckCircle2, KeyRound, Building2, MessageSquareQuote,
  Rocket, Brain, HelpCircle, ChevronDown, ChevronUp,
  RotateCcw, Sparkles, Quote, GraduationCap, TrendingUp,
  Award, Zap, BookOpen, Star,
} from "lucide-react";

// ============================================
// INLINE MARKDOWN
// ============================================
export const renderInlineMarkdown = (text: string): (string | JSX.Element)[] => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

// ============================================
// LUXE ICON WRAPPER — glass + gradient + glow
// ============================================
const LuxeIcon = ({ children, gradient, glow }: {
  children: React.ReactNode;
  gradient: string;
  glow: string;
}) => (
  <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${gradient}`}>
    <div className={`absolute inset-0 rounded-xl blur-md opacity-40 ${glow}`} />
    <div className="relative z-10">{children}</div>
  </div>
);

// ============================================
// KNOWLEDGE CHECK
// Syntax: [?] Question | wrong | correct* | wrong
// ============================================
const KnowledgeCheck = ({ question, options, correctIndex }: {
  question: string; options: string[]; correctIndex: number;
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selected === correctIndex;

  return (
    <div className="my-8 rounded-2xl border border-purple-200/60 dark:border-purple-800/60 bg-white dark:bg-gray-900 overflow-hidden shadow-xl shadow-purple-500/5">
      {/* Premium header */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-pink-600 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-sm tracking-wide">KENNISCHECK</span>
          <p className="text-white/70 text-xs">Test je begrip</p>
        </div>
      </div>
      <div className="p-6">
        <p className="font-semibold text-gray-900 dark:text-white mb-5 text-base">{question}</p>
        <div className="space-y-3">
          {options.map((opt, idx) => {
            let cls = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:border-purple-600 dark:hover:bg-purple-900/20 cursor-pointer';
            if (selected === idx && !showResult) cls = 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 ring-2 ring-purple-500/30';
            if (showResult && idx === correctIndex) cls = 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500/30';
            if (showResult && selected === idx && idx !== correctIndex) cls = 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-400/30';
            return (
              <button key={idx} onClick={() => !showResult && setSelected(idx)} disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${cls}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  showResult && idx === correctIndex ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-md shadow-green-500/30'
                  : showResult && selected === idx ? 'bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-md shadow-red-500/30'
                  : selected === idx ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {showResult && idx === correctIndex ? '✓' : showResult && selected === idx ? '✗' : String.fromCharCode(65 + idx)}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{opt}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5">
          {!showResult ? (
            <button onClick={() => selected !== null && setShowResult(true)} disabled={selected === null}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                selected !== null
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}>
              Controleer antwoord
            </button>
          ) : (
            <div className={`p-5 rounded-xl flex items-start gap-4 ${
              isCorrect ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800'
              : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCorrect ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-md shadow-green-500/30' : 'bg-gradient-to-br from-amber-400 to-orange-600 shadow-md shadow-amber-500/30'
              }`}>
                {isCorrect ? <Award className="w-5 h-5 text-white" /> : <Lightbulb className="w-5 h-5 text-white" />}
              </div>
              <div>
                <p className={`font-bold text-sm ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'}`}>
                  {isCorrect ? 'Uitstekend!' : 'Bijna...'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isCorrect ? 'Je hebt het juiste antwoord gekozen. Ga zo door!' : `Het juiste antwoord is: ${options[correctIndex]}`}
                </p>
                {!isCorrect && (
                  <button onClick={() => { setSelected(null); setShowResult(false); }}
                    className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-semibold flex items-center gap-1.5 group">
                    <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500" /> Opnieuw proberen
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// REFLECTION PROMPT
// Syntax: [!] Question
// ============================================
const ReflectionPrompt = ({ question }: { question: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [answer, setAnswer] = useState('');

  return (
    <div className="my-8 rounded-2xl border border-indigo-200/60 dark:border-indigo-800/60 bg-white dark:bg-gray-900 overflow-hidden shadow-lg shadow-indigo-500/5">
      <button onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors">
        <LuxeIcon gradient="bg-gradient-to-br from-indigo-500 to-blue-600" glow="bg-indigo-500">
          <HelpCircle className="w-5 h-5 text-white" />
        </LuxeIcon>
        <div className="flex-1">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Reflectie</p>
          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mt-0.5">{question}</p>
        </div>
        {isExpanded
          ? <ChevronUp className="w-5 h-5 text-indigo-400 shrink-0" />
          : <ChevronDown className="w-5 h-5 text-indigo-400 shrink-0" />}
      </button>
      {isExpanded && (
        <div className="px-6 pb-5 border-t border-indigo-100 dark:border-indigo-800/50">
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
            placeholder="Schrijf je gedachten hier..."
            className="w-full mt-4 p-4 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-gray-50 dark:bg-gray-800 text-sm resize-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none min-h-[100px] transition-shadow" />
        </div>
      )}
    </div>
  );
};

// ============================================
// CALLOUT CONFIG — Luxe icon treatment
// ============================================
interface CalloutConfig {
  icon: React.ReactNode;
  title: string;
  gradient: string;
  glow: string;
  bgClass: string;
  borderClass: string;
  titleClass: string;
  accentClass: string;
}

const CALLOUT_PATTERNS: [string, CalloutConfig][] = [
  ['💡', {
    icon: <Lightbulb className="w-5 h-5 text-white" />, title: 'Tip',
    gradient: 'bg-gradient-to-br from-amber-400 to-orange-500', glow: 'bg-amber-400',
    bgClass: 'bg-amber-50/80 dark:bg-amber-950/20', borderClass: 'border-amber-200/60 dark:border-amber-800/60',
    titleClass: 'text-amber-800 dark:text-amber-300', accentClass: 'from-amber-400 to-orange-500',
  }],
  ['⚠️', {
    icon: <AlertTriangle className="w-5 h-5 text-white" />, title: 'Let op',
    gradient: 'bg-gradient-to-br from-orange-400 to-red-500', glow: 'bg-orange-400',
    bgClass: 'bg-orange-50/80 dark:bg-orange-950/20', borderClass: 'border-orange-200/60 dark:border-orange-800/60',
    titleClass: 'text-orange-800 dark:text-orange-300', accentClass: 'from-orange-400 to-red-500',
  }],
  ['📌', {
    icon: <Pin className="w-5 h-5 text-white" />, title: 'Belangrijk',
    gradient: 'bg-gradient-to-br from-red-400 to-rose-600', glow: 'bg-red-400',
    bgClass: 'bg-red-50/80 dark:bg-red-950/20', borderClass: 'border-red-200/60 dark:border-red-800/60',
    titleClass: 'text-red-800 dark:text-red-300', accentClass: 'from-red-400 to-rose-600',
  }],
  ['🎯', {
    icon: <Target className="w-5 h-5 text-white" />, title: 'Kernpunt',
    gradient: 'bg-gradient-to-br from-purple-500 to-violet-600', glow: 'bg-purple-500',
    bgClass: 'bg-purple-50/80 dark:bg-purple-950/20', borderClass: 'border-purple-200/60 dark:border-purple-800/60',
    titleClass: 'text-purple-800 dark:text-purple-300', accentClass: 'from-purple-500 to-violet-600',
  }],
  ['📊', {
    icon: <TrendingUp className="w-5 h-5 text-white" />, title: 'Data & Statistiek',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600', glow: 'bg-blue-500',
    bgClass: 'bg-blue-50/80 dark:bg-blue-950/20', borderClass: 'border-blue-200/60 dark:border-blue-800/60',
    titleClass: 'text-blue-800 dark:text-blue-300', accentClass: 'from-blue-500 to-cyan-600',
  }],
  ['✅', {
    icon: <CheckCircle2 className="w-5 h-5 text-white" />, title: 'Onthoud',
    gradient: 'bg-gradient-to-br from-green-400 to-emerald-600', glow: 'bg-green-400',
    bgClass: 'bg-green-50/80 dark:bg-green-950/20', borderClass: 'border-green-200/60 dark:border-green-800/60',
    titleClass: 'text-green-800 dark:text-green-300', accentClass: 'from-green-400 to-emerald-600',
  }],
  ['🔑', {
    icon: <KeyRound className="w-5 h-5 text-white" />, title: 'Sleutelbegrip',
    gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600', glow: 'bg-indigo-500',
    bgClass: 'bg-indigo-50/80 dark:bg-indigo-950/20', borderClass: 'border-indigo-200/60 dark:border-indigo-800/60',
    titleClass: 'text-indigo-800 dark:text-indigo-300', accentClass: 'from-indigo-500 to-purple-600',
  }],
  ['🏢', {
    icon: <Building2 className="w-5 h-5 text-white" />, title: 'Praktijkvoorbeeld',
    gradient: 'bg-gradient-to-br from-cyan-500 to-teal-600', glow: 'bg-cyan-500',
    bgClass: 'bg-cyan-50/80 dark:bg-cyan-950/20', borderClass: 'border-cyan-200/60 dark:border-cyan-800/60',
    titleClass: 'text-cyan-800 dark:text-cyan-300', accentClass: 'from-cyan-500 to-teal-600',
  }],
  ['💬', {
    icon: <MessageSquareQuote className="w-5 h-5 text-white" />, title: 'Citaat',
    gradient: 'bg-gradient-to-br from-gray-500 to-slate-600', glow: 'bg-gray-500',
    bgClass: 'bg-gray-50/80 dark:bg-gray-800/50', borderClass: 'border-gray-200/60 dark:border-gray-700/60',
    titleClass: 'text-gray-800 dark:text-gray-300', accentClass: 'from-gray-500 to-slate-600',
  }],
  ['🚀', {
    icon: <Rocket className="w-5 h-5 text-white" />, title: 'Pro Tip',
    gradient: 'bg-gradient-to-br from-violet-500 to-fuchsia-600', glow: 'bg-violet-500',
    bgClass: 'bg-violet-50/80 dark:bg-violet-950/20', borderClass: 'border-violet-200/60 dark:border-violet-800/60',
    titleClass: 'text-violet-800 dark:text-violet-300', accentClass: 'from-violet-500 to-fuchsia-600',
  }],
];

const getCalloutConfig = (line: string): CalloutConfig | null => {
  for (const [emoji, config] of CALLOUT_PATTERNS) {
    if (line.startsWith(emoji)) return config;
  }
  return null;
};

const stripCalloutEmoji = (line: string): string => {
  for (const [emoji] of CALLOUT_PATTERNS) {
    if (line.startsWith(emoji)) return line.slice(emoji.length).trim();
  }
  return line;
};

// ============================================
// TABLE RENDERER — Premium
// ============================================
const renderTable = (lines: string[], startKey: number): { element: JSX.Element; linesConsumed: number } => {
  const tableLines: string[] = [];
  for (const line of lines) {
    if (line.trim().startsWith('|')) tableLines.push(line.trim());
    else break;
  }
  if (tableLines.length < 2) return { element: <></>, linesConsumed: 0 };

  const parseRow = (row: string): string[] =>
    row.split('|').filter(c => c.trim() !== '' && !c.match(/^[\s-:]+$/)).map(c => c.trim());

  const headers = parseRow(tableLines[0]);
  const isSep = (row: string) => row.replace(/[\s|:-]/g, '') === '';
  const startIdx = isSep(tableLines[1]) ? 2 : 1;
  const dataRows = tableLines.slice(startIdx).map(parseRow);

  return {
    element: (
      <div key={startKey} className="my-6 overflow-x-auto rounded-2xl border border-purple-100 dark:border-purple-900/50 shadow-lg shadow-purple-500/5 bg-white dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-purple-600 to-pink-600">
              {headers.map((h, i) => (
                <th key={i} className="px-5 py-3.5 text-left font-bold text-white text-xs tracking-wide uppercase">
                  {renderInlineMarkdown(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} className={`${ri % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-purple-50/30 dark:bg-purple-900/5'} hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors`}>
                {row.map((cell, ci) => (
                  <td key={ci} className={`px-5 py-3.5 text-gray-700 dark:text-gray-300 border-b border-purple-50 dark:border-purple-900/30 ${ci === 0 ? 'font-medium text-gray-900 dark:text-white' : ''}`}>
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    linesConsumed: tableLines.length,
  };
};

// ============================================
// HELPERS
// ============================================
const isHeadingLine = (line: string): boolean => {
  const t = line.trim();
  return t.startsWith('**') && t.endsWith('**') && !t.slice(2, -2).includes('**');
};

// ============================================
// MAIN RENDERER
// ============================================
export const renderMarkdownBlock = (text: string): JSX.Element => {
  if (!text) return <></>;

  const lines = text.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    // Empty line
    if (trimmed === '') { elements.push(<div key={key++} className="h-3" />); i++; continue; }

    // Knowledge check: [?] Question | wrong | correct* | wrong
    if (trimmed.startsWith('[?]')) {
      const parts = trimmed.slice(3).split('|').map(p => p.trim());
      if (parts.length >= 3) {
        const question = parts[0];
        const options: string[] = [];
        let correctIdx = 0;
        parts.slice(1).forEach((opt, idx) => {
          if (opt.endsWith('*')) { correctIdx = idx; options.push(opt.slice(0, -1).trim()); }
          else { options.push(opt); }
        });
        elements.push(<KnowledgeCheck key={key++} question={question} options={options} correctIndex={correctIdx} />);
      }
      i++; continue;
    }

    // Reflection: [!] Question
    if (trimmed.startsWith('[!]')) {
      elements.push(<ReflectionPrompt key={key++} question={trimmed.slice(3).trim()} />);
      i++; continue;
    }

    // Table
    if (trimmed.startsWith('|')) {
      const { element, linesConsumed } = renderTable(lines.slice(i).map(l => l.trim()), key++);
      if (linesConsumed > 0) { elements.push(element); i += linesConsumed; continue; }
    }

    // Callout (emoji trigger → luxe Lucide icon card)
    const callout = getCalloutConfig(trimmed);
    if (callout) {
      const calloutLines: string[] = [stripCalloutEmoji(trimmed)];
      i++;
      while (i < lines.length && lines[i].trim() !== '' && !getCalloutConfig(lines[i].trim()) && !isHeadingLine(lines[i]) && !lines[i].trim().startsWith('[?]') && !lines[i].trim().startsWith('[!]') && !lines[i].trim().startsWith('|')) {
        calloutLines.push(lines[i].trim()); i++;
      }
      elements.push(
        <div key={key++} className={`my-6 rounded-2xl border ${callout.borderClass} ${callout.bgClass} overflow-hidden shadow-lg shadow-black/5`}>
          <div className="flex items-start gap-4 p-5">
            <LuxeIcon gradient={callout.gradient} glow={callout.glow}>
              {callout.icon}
            </LuxeIcon>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-xs tracking-wide uppercase mb-2 ${callout.titleClass}`}>{callout.title}</p>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-1.5">
                {calloutLines.map((cl, ci) => {
                  if (cl.startsWith('- ')) return (
                    <div key={ci} className="flex items-start gap-2.5 py-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-gradient-to-br ${callout.accentClass}`} />
                      <span>{renderInlineMarkdown(cl.slice(2))}</span>
                    </div>
                  );
                  if (/^\d+\.\s/.test(cl)) {
                    const num = cl.match(/^(\d+)\./)?.[1];
                    return (
                      <div key={ci} className="flex items-start gap-2.5 py-0.5">
                        <span className={`font-bold text-xs mt-0.5 shrink-0 ${callout.titleClass}`}>{num}.</span>
                        <span>{renderInlineMarkdown(cl.replace(/^\d+\.\s*/, ''))}</span>
                      </div>
                    );
                  }
                  return <p key={ci}>{renderInlineMarkdown(cl)}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) { quoteLines.push(lines[i].trim().slice(2)); i++; }
      elements.push(
        <blockquote key={key++} className="my-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-100 dark:border-purple-800/50 py-5 px-6 shadow-md shadow-purple-500/5">
          <Quote className="w-6 h-6 text-purple-300 dark:text-purple-600 mb-3" />
          {quoteLines.map((ql, qi) => (
            <p key={qi} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic font-medium">
              {renderInlineMarkdown(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '===' || trimmed === '***') {
      elements.push(
        <div key={key++} className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300/50 dark:via-purple-700/50 to-transparent" />
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-300 dark:bg-purple-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-pink-300 dark:bg-pink-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-300 dark:bg-purple-700" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300/50 dark:via-purple-700/50 to-transparent" />
        </div>
      );
      i++; continue;
    }

    // Heading — premium
    if (isHeadingLine(trimmed)) {
      elements.push(
        <div key={key++} className="mt-10 mb-4 first:mt-0">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-purple-500 via-violet-500 to-pink-500 shadow-sm shadow-purple-500/30" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{trimmed.slice(2, -2)}</h3>
          </div>
        </div>
      );
      i++; continue;
    }

    // Numbered list — premium badges
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: { num: string; content: string; subItems: string[] }[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const match = lines[i].trim().match(/^(\d+)\.\s*(.*)/);
        if (match) {
          const subItems: string[] = []; i++;
          while (i < lines.length && lines[i].trim().startsWith('- ')) { subItems.push(lines[i].trim().slice(2)); i++; }
          listItems.push({ num: match[1], content: match[2], subItems });
        } else { i++; }
      }
      elements.push(
        <div key={key++} className="my-5 space-y-3">
          {listItems.map((item, li) => (
            <div key={li} className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-purple-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/30 group-hover:scale-105 transition-all duration-200">
                <span className="text-white text-xs font-bold">{item.num}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{renderInlineMarkdown(item.content)}</p>
                {item.subItems.length > 0 && (
                  <div className="mt-2 ml-1 space-y-1">
                    {item.subItems.map((sub, si) => (
                      <div key={si} className="flex items-start gap-2 py-0.5">
                        <div className="w-1 h-1 rounded-full bg-purple-400/60 mt-2 shrink-0" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{renderInlineMarkdown(sub)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // Bullet list
    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) { items.push(lines[i].trim().slice(2)); i++; }
      elements.push(
        <div key={key++} className="my-4 space-y-2">
          {items.map((item, bi) => (
            <div key={bi} className="flex items-start gap-3 py-0.5">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mt-1.5 shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{renderInlineMarkdown(item)}</span>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed my-2">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
};
