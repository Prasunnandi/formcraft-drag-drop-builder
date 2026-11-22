import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initialForms } from './data.js';

const app = express();
const PORT = process.env.PORT || 5007;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

let forms = [...initialForms];

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'FormCraft Dynamic JSON-Schema Form Engine',
    version: '1.0.0'
  });
});

// Analytics
app.get('/api/v1/analytics/form-stats', (req, res) => {
  const totalSubmissions = forms.reduce((acc, f) => acc + (f.submissionsCount || 0), 0);
  const avgCompletion = round(forms.reduce((acc, f) => acc + (f.completionRatePct || 80), 0) / forms.length, 1);

  res.json({
    totalForms: forms.length,
    publishedForms: forms.filter(f => f.status === 'PUBLISHED').length,
    totalSubmissions: totalSubmissions,
    averageCompletionRatePct: avgCompletion
  });
});

function round(num, dec) {
  const factor = Math.pow(10, dec);
  return Math.round(num * factor) / factor;
}

// List forms
app.get('/api/v1/forms', (req, res) => {
  res.json(forms);
});

// Get form
app.get('/api/v1/forms/:id', (req, res) => {
  const form = forms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: 'Form not found' });
  res.json(form);
});

// Create/Save form
app.post('/api/v1/forms', (req, res) => {
  const { title, category, schema } = req.body;
  const newForm = {
    id: `FORM-${Math.floor(100 + Math.random() * 899)}`,
    title: title || 'Untitled Custom Form',
    category: category || 'General Operations',
    status: 'PUBLISHED',
    submissionsCount: 0,
    completionRatePct: 100.0,
    schema: schema || { title: title || 'Untitled', fields: [] }
  };
  forms.unshift(newForm);
  res.status(201).json(newForm);
});

// Submit form
app.post('/api/v1/forms/:id/submit', (req, res) => {
  const form = forms.find(f => f.id === req.params.id);
  if (!form) return res.status(404).json({ error: 'Form not found' });
  form.submissionsCount = (form.submissionsCount || 0) + 1;
  res.json({
    message: 'Submission successfully recorded',
    submissionId: `SUB-${Date.now()}`,
    data: req.body
  });
});

app.listen(PORT, () => {
  console.log(`FormCraft backend listening on port http://localhost:${PORT}`);
});
