import React from 'react';
import { 
  Layers, 
  FileEdit, 
  Send, 
  CheckCircle2, 
  Code, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react';

export default function FormTemplatesLibrary({ forms, stats, onOpenBuilder, onNewForm }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Enterprise Form Templates & Schema Repository
          </h2>
          <p className="text-xs text-slate-400">
            Pre-built JSON-schema forms with conditional branching, validation rules, and submission tracking.
          </p>
        </div>

        <button
          onClick={onNewForm}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg shadow-blue-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>Create Blank Form</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Published Form Schemas</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {stats?.publishedForms || 2} Forms
          </div>
          <div className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
            <Code className="w-3 h-3" /> JSON Schema Draft-07
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Total User Submissions</div>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">
            {(stats?.totalSubmissions || 2000).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across web & mobile embedding</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Average Completion Rate</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {stats?.averageCompletionRatePct || 88.2}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% vs static forms
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">Conditional Rules Engine</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">Active</div>
          <div className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Dynamic Field Visibility
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forms.map((form) => (
          <div 
            key={form.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {form.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold">
                  {form.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-1">{form.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{form.category}</p>

              <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Form Fields</span>
                  <span className="text-white font-bold">{form.schema?.fields?.length || 0} fields</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Submissions</span>
                  <span className="text-blue-400 font-bold">{form.submissionsCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Completion Rate</span>
                  <span className="text-emerald-400 font-bold">{form.completionRatePct}%</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onOpenBuilder(form)}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
              >
                <FileEdit className="w-3.5 h-3.5 text-blue-400" />
                <span>Open in Drag & Drop Builder</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
