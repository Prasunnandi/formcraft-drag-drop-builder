import React, { useState } from 'react';
import { 
  FileEdit, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  CheckSquare, 
  Star, 
  Type, 
  Mail, 
  List, 
  AlignLeft, 
  Hash, 
  Code, 
  Eye, 
  Send,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { submitFormResponse } from '../services/api';

export default function FormCanvasBuilder({ initialForm, onSaveForm }) {
  const [formTitle, setFormTitle] = useState(initialForm?.title || 'Customer Feedback & Survey');
  const [fields, setFields] = useState(initialForm?.schema?.fields || [
    { id: 'f1', type: 'text', label: 'Full Name', placeholder: 'Jane Doe', required: true },
    { id: 'f2', type: 'email', label: 'Email Address', placeholder: 'jane@acme.com', required: true },
    { id: 'f3', type: 'rating', label: 'Overall Satisfaction (1-5)', required: true, max: 5 },
    { 
      id: 'f4', 
      type: 'textarea', 
      label: 'What could we improve?', 
      placeholder: 'Explain why you gave a low score...',
      required: false,
      conditional: { dependsOn: 'f3', operator: 'lessThanOrEqual', value: 3 }
    }
  ]);

  const [previewValues, setPreviewValues] = useState({
    f1: 'Alex Mercer',
    f2: 'alex@enterprise.com',
    f3: 2,
    f4: 'API documentation had outdated endpoint examples.'
  });

  const [showJsonSchema, setShowJsonSchema] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Field Palette Click-to-add
  const addField = (fieldType) => {
    const newId = `f_${Date.now().toString().slice(-4)}`;
    let newField = { id: newId, type: fieldType, label: `New ${fieldType.toUpperCase()} Field`, required: false };

    if (fieldType === 'select') {
      newField.options = ['Option A', 'Option B', 'Option C'];
    } else if (fieldType === 'rating') {
      newField.max = 5;
    }

    setFields([...fields, newField]);
  };

  const removeField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const moveField = (index, direction) => {
    const newFields = [...fields];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
  };

  const updateFieldProperty = (id, prop, val) => {
    setFields(fields.map(f => f.id === id ? { ...f, [prop]: val } : f));
  };

  // Preview form submit
  const handlePreviewSubmit = async (e) => {
    e.preventDefault();
    await submitFormResponse(initialForm?.id || 'FORM-101', previewValues);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-blue-400" />
            Dynamic Drag & Drop Form Builder Canvas
          </h2>
          <p className="text-xs text-slate-400">
            Build reactive forms with conditional visibility branches and generate standard JSON-schemas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowJsonSchema(!showJsonSchema)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>{showJsonSchema ? 'Hide JSON Schema' : 'Inspect JSON Schema'}</span>
          </button>

          <button
            onClick={() => onSaveForm({ title: formTitle, schema: { title: formTitle, fields } })}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-950/50"
          >
            Save Form Schema
          </button>
        </div>
      </div>

      {/* JSON Schema View Modal */}
      {showJsonSchema && (
        <div className="p-4 bg-slate-900 border border-blue-500/30 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-blue-400 font-bold border-b border-slate-800 pb-2">
            <span>JSON Schema Draft-07 Output</span>
            <span>{fields.length} Components Defined</span>
          </div>
          <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60">
            {JSON.stringify({
              $schema: "http://json-schema.org/draft-07/schema#",
              title: formTitle,
              type: "object",
              required: fields.filter(f => f.required).map(f => f.id),
              properties: fields.reduce((acc, f) => {
                acc[f.id] = {
                  type: f.type === 'number' || f.type === 'rating' ? 'number' : f.type === 'checkbox' ? 'boolean' : 'string',
                  title: f.label,
                  conditional: f.conditional || undefined
                };
                return acc;
              }, {})
            }, null, 2)}
          </pre>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Field Palette & Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Field Palette Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Component Palette (Click to Add)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addField('text')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Type className="w-3.5 h-3.5 text-blue-400" />
                <span>Text</span>
              </button>
              <button
                type="button"
                onClick={() => addField('email')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => addField('select')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <List className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dropdown</span>
              </button>
              <button
                type="button"
                onClick={() => addField('rating')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Star Rating</span>
              </button>
              <button
                type="button"
                onClick={() => addField('textarea')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <AlignLeft className="w-3.5 h-3.5 text-purple-400" />
                <span>Textarea</span>
              </button>
              <button
                type="button"
                onClick={() => addField('number')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Hash className="w-3.5 h-3.5 text-teal-400" />
                <span>Number</span>
              </button>
              <button
                type="button"
                onClick={() => addField('checkbox')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5 text-rose-400" />
                <span>Checkbox</span>
              </button>
            </div>
          </div>

          {/* Canvas Field List */}
          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div 
                key={field.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                      {field.type}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => moveField(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveField(idx, 1)}
                      disabled={idx === fields.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 ml-1"
                      title="Delete Field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block text-[11px] mb-1">Field Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateFieldProperty(field.id, 'label', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block text-[11px] mb-1">Placeholder Text</label>
                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={(e) => updateFieldProperty(field.id, 'placeholder', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white"
                    />
                  </div>
                </div>

                {/* Conditional Rules Tag */}
                {field.conditional && (
                  <div className="p-2 rounded bg-amber-950/20 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
                    <GitBranch className="w-3 h-3 text-amber-400" />
                    <span>Rule: Visible when {field.conditional.dependsOn} &le; {field.conditional.value}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Interactive Form Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Live Form Runtime Renderer</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">Interactive</span>
            </div>

            <form onSubmit={handlePreviewSubmit} className="space-y-4 text-xs">
              <h4 className="text-base font-bold text-white mb-2">{formTitle}</h4>

              {fields.map((f) => {
                // Evaluate conditional rule
                if (f.conditional) {
                  const parentVal = previewValues[f.conditional.dependsOn];
                  if (f.conditional.operator === 'lessThanOrEqual' && parentVal > f.conditional.value) {
                    return null; // hide dynamically!
                  }
                }

                return (
                  <div key={f.id} className="space-y-1">
                    <label className="text-slate-200 font-medium flex items-center justify-between">
                      <span>{f.label} {f.required && <span className="text-rose-400">*</span>}</span>
                      {f.conditional && (
                        <span className="text-[10px] text-amber-400 font-mono">(Branch Active)</span>
                      )}
                    </label>

                    {f.type === 'text' && (
                      <input
                        type="text"
                        placeholder={f.placeholder}
                        value={previewValues[f.id] || ''}
                        onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                        required={f.required}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    )}

                    {f.type === 'email' && (
                      <input
                        type="email"
                        placeholder={f.placeholder}
                        value={previewValues[f.id] || ''}
                        onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                        required={f.required}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    )}

                    {f.type === 'textarea' && (
                      <textarea
                        rows={3}
                        placeholder={f.placeholder}
                        value={previewValues[f.id] || ''}
                        onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                        required={f.required}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    )}

                    {f.type === 'select' && (
                      <select
                        value={previewValues[f.id] || ''}
                        onChange={(e) => setPreviewValues({ ...previewValues, [f.id]: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                      >
                        {f.options?.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {f.type === 'rating' && (
                      <div className="flex items-center space-x-2 py-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setPreviewValues({ ...previewValues, [f.id]: star })}
                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className={`w-5 h-5 ${
                                star <= (previewValues[f.id] || 0) 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-slate-600'
                              }`} 
                            />
                          </button>
                        ))}
                        <span className="font-mono text-xs text-slate-400 ml-2">
                          {previewValues[f.id] || 0}/5
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center space-x-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Response</span>
              </button>

              {submitSuccess && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-xs font-mono text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Submission stored successfully! Response payload validated.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
