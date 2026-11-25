import React, { useState } from 'react';

/**
 * Interactive Drag-and-Drop Form Canvas Component
 * Supports dynamic form construction, field palette dragging, property editing, and JSON schema export.
 */

export const FIELD_TYPES = [
  { type: 'text', label: 'Text Field', icon: '📝', defaultProps: { label: 'Single Line Text', placeholder: 'Enter value...', required: false } },
  { type: 'textarea', label: 'Paragraph Text', icon: '📄', defaultProps: { label: 'Detailed Description', placeholder: 'Enter comments...', required: false } },
  { type: 'select', label: 'Dropdown Select', icon: '🔽', defaultProps: { label: 'Select Category', options: ['Option A', 'Option B', 'Option C'], required: true } },
  { type: 'file', label: 'File Upload', icon: '📎', defaultProps: { label: 'Attach Documents', acceptedFormats: '.pdf,.png,.jpg', maxSizeMb: 10 } },
  { type: 'matrix', label: 'Likert Matrix', icon: '📊', defaultProps: { label: 'Service Evaluation', statements: ['Ease of Use', 'Support Quality', 'Value'], scale: [1, 2, 3, 4, 5] } },
  { type: 'date', label: 'Date Picker', icon: '📅', defaultProps: { label: 'Target Date', required: false } }
];

export function FormBuilderCanvas({ initialFields = [], onSaveSchema }) {
  const [fields, setFields] = useState(initialFields.length > 0 ? initialFields : [
    { id: 'f-1', type: 'text', label: 'Full Legal Name', placeholder: 'e.g. John Doe', required: true },
    { id: 'f-2', type: 'select', label: 'Department / Team', options: ['Engineering', 'Product', 'Operations'], required: true }
  ]);
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id || null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Add field from palette
  const handleAddField = (fieldTypeDef) => {
    const newField = {
      id: `f-${Date.now()}`,
      type: fieldTypeDef.type,
      ...fieldTypeDef.defaultProps
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  // Move field up/down
  const handleMove = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= fields.length) return;
    const reordered = [...fields];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setFields(reordered);
  };

  // Remove field
  const handleDelete = (id) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  // Update selected field property
  const handlePropertyChange = (prop, value) => {
    setFields(fields.map(f => f.id === selectedFieldId ? { ...f, [prop]: value } : f));
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">
      {/* 1. Component Palette Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Field Palette</h2>
        <div className="space-y-2">
          {FIELD_TYPES.map(ft => (
            <button
              key={ft.type}
              onClick={() => handleAddField(ft)}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition text-left text-sm font-medium"
            >
              <span className="text-lg">{ft.icon}</span>
              <span>{ft.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="w-full py-2 px-4 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition"
          >
            {isPreviewMode ? '✏️ Back to Canvas' : '👁️ Preview Form'}
          </button>
        </div>
      </div>

      {/* 2. Main Drag-and-Drop Canvas */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Dynamic Form Canvas</h1>
              <p className="text-xs text-slate-500">Configure elements, constraints, and layout</p>
            </div>
            <button
              onClick={() => onSaveSchema && onSaveSchema(fields)}
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
            >
              Export Schema
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-slate-300 rounded-lg text-center text-slate-400 text-sm">
              Drag or click fields from the palette to construct your form.
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  onClick={() => !isPreviewMode && setSelectedFieldId(field.id)}
                  className={`p-4 rounded-lg border transition cursor-pointer relative ${
                    selectedFieldId === field.id && !isPreviewMode
                      ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <label className="text-sm font-semibold text-slate-700">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {!isPreviewMode && (
                      <div className="flex space-x-1">
                        <button onClick={(e) => { e.stopPropagation(); handleMove(idx, -1); }} className="text-xs px-1.5 py-0.5 rounded hover:bg-slate-100">↑</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMove(idx, 1); }} className="text-xs px-1.5 py-0.5 rounded hover:bg-slate-100">↓</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(field.id); }} className="text-xs px-1.5 py-0.5 rounded text-red-600 hover:bg-red-50">✕</button>
                      </div>
                    )}
                  </div>

                  {/* Field Preview Rendering */}
                  {field.type === 'text' && (
                    <input type="text" placeholder={field.placeholder} disabled={!isPreviewMode} className="w-full text-sm p-2 border rounded border-slate-300 bg-slate-50" />
                  )}
                  {field.type === 'textarea' && (
                    <textarea placeholder={field.placeholder} rows={2} disabled={!isPreviewMode} className="w-full text-sm p-2 border rounded border-slate-300 bg-slate-50" />
                  )}
                  {field.type === 'select' && (
                    <select disabled={!isPreviewMode} className="w-full text-sm p-2 border rounded border-slate-300 bg-slate-50">
                      {(field.options || []).map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  )}
                  {field.type === 'file' && (
                    <div className="border border-dashed border-slate-300 p-3 rounded text-center text-xs text-slate-500">
                      Upload File ({field.acceptedFormats || '*'}, max {field.maxSizeMb || 10}MB)
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Property Inspector Sidebar */}
      {!isPreviewMode && selectedField && (
        <div className="w-72 border-l border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Field Properties</h2>
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Field Label</label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => handlePropertyChange('label', e.target.value)}
                className="w-full p-2 border rounded border-slate-300"
              />
            </div>
            {selectedField.placeholder !== undefined && (
              <div>
                <label className="font-medium text-slate-700 block mb-1">Placeholder</label>
                <input
                  type="text"
                  value={selectedField.placeholder}
                  onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                  className="w-full p-2 border rounded border-slate-300"
                />
              </div>
            )}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="req"
                checked={!!selectedField.required}
                onChange={(e) => handlePropertyChange('required', e.target.checked)}
              />
              <label htmlFor="req" className="font-medium text-slate-700">Mandatory / Required</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormBuilderCanvas;
