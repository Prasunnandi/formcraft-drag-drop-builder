import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Database,
  Eye,
  Check,
  ChevronRight
} from 'lucide-react';

export default function FormSubmissionsView() {
  const [selectedSub, setSelectedSub] = useState(null);
  const [search, setSearch] = useState('');

  const mockSubmissions = [
    {
      id: "SUB-8092",
      formId: "FORM-101",
      formTitle: "Customer CSAT & Product Feedback Survey",
      submittedAt: "2026-03-29 17:42:10 UTC",
      respondentEmail: "sarah.connor@cyberdyne.io",
      status: "VERIFIED",
      completionTimeSec: 64,
      payload: {
        fullName: "Sarah Connor",
        workEmail: "sarah.connor@cyberdyne.io",
        rating: 5,
        primaryRole: "DevOps / SRE",
        feedbackNotes: "The automated schema generation and high-throughput webhooks cut our custom intake engineering time by 80%.",
        confidentialBetaAgreed: true
      }
    },
    {
      id: "SUB-8091",
      formId: "FORM-102",
      formTitle: "Employee Equipment & Hardware Requisition",
      submittedAt: "2026-03-29 16:15:33 UTC",
      respondentEmail: "marcus.vance@acme-cloud.com",
      status: "VERIFIED",
      completionTimeSec: 42,
      payload: {
        employeeName: "Marcus Vance",
        laptopModel: "MacBook Pro 16 M3 Max",
        monitorsRequested: 2,
        shippingAddress: "452 Mission Street, Suite 900, San Francisco, CA"
      }
    },
    {
      id: "SUB-8089",
      formId: "FORM-103",
      formTitle: "Enterprise Vendor Risk Assessment (SOC2)",
      submittedAt: "2026-03-29 14:02:49 UTC",
      respondentEmail: "ciso-sec@datastream.net",
      status: "PENDING_AUDIT",
      completionTimeSec: 218,
      payload: {
        vendorName: "DataStream Networks LLC",
        soc2ComplianceDoc: "s3://compliance-vault/audits/2026/datastream-soc2-type2.pdf",
        encryptionAtRest: "AES-256 GCM",
        samlSsoSupported: true,
        disasterRecoveryRTOHours: 2
      }
    },
    {
      id: "SUB-8085",
      formId: "FORM-104",
      formTitle: "Patient Medical Intake & Consent",
      submittedAt: "2026-03-29 11:20:05 UTC",
      respondentEmail: "pat-92819@secure-health.org",
      status: "HIPAA_ENCRYPTED",
      completionTimeSec: 155,
      payload: {
        patientInitials: "E.R.",
        dobMasked: "1988-**-**",
        primarySymptom: "Persistent Migraine & Visual Aura",
        allergies: ["Penicillin", "Sulfa drugs"],
        consentSignatureSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    }
  ];

  const filtered = mockSubmissions.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.formTitle.toLowerCase().includes(search.toLowerCase()) ||
    s.respondentEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Form Submissions & Event Ingestion</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time payload stream, schema validation events, and immutable audit logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition">
            <Download className="w-3.5 h-3.5" />
            Export JSONL
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, form, respondent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            PostgreSQL JSONB Store
          </span>
          <span className="mx-1">•</span>
          <span className="font-semibold text-slate-700">{filtered.length} Recorded Submissions</span>
        </div>
      </div>

      {/* Grid: Submissions Table & JSON Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table list */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">Ingested Responses Stream</h2>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Sync Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {filtered.map((sub) => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div 
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`p-4 transition cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                    isSelected ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{sub.id}</span>
                      <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                        sub.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        sub.status === 'HIPAA_ENCRYPTED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 line-clamp-1">{sub.formTitle}</p>
                    <div className="flex items-center gap-3 text-2xs text-slate-400">
                      <span>{sub.respondentEmail}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {sub.completionTimeSec}s completion
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      className="p-1.5 rounded-md hover:bg-slate-200/60 text-slate-400 hover:text-slate-700"
                      title="Inspect JSON Payload"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payload Inspector Detail Panel */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold tracking-tight">Structured Payload Inspector</h3>
              </div>
              <span className="font-mono text-2xs text-slate-400">
                {selectedSub ? selectedSub.id : 'NO SELECTION'}
              </span>
            </div>

            {selectedSub ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-2xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 block mb-0.5">Form Template</span>
                    <span className="font-semibold text-slate-200">{selectedSub.formId}</span>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400 block mb-0.5">Validated Timestamp</span>
                    <span className="font-mono text-slate-200">{selectedSub.submittedAt}</span>
                  </div>
                </div>

                <div>
                  <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
                    Parsed JSONB Document
                  </span>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-2xs font-mono text-emerald-400 overflow-x-auto max-h-80 select-all">
                    {JSON.stringify(selectedSub.payload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                <Eye className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs">Click on any submission on the left to inspect its dynamic JSON schema properties and validated data.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-2xs text-slate-400">
            <span>Schema Compliant: RFC 7159</span>
            <span className="text-indigo-400 font-mono">200 OK • Auto-Indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
