// FormCraft Seed Data & Form Schemas

export const initialForms = [
  {
    id: "FORM-101",
    title: "Customer CSAT & Product Feedback Survey",
    category: "Customer Experience",
    status: "PUBLISHED",
    submissionsCount: 1420,
    completionRatePct: 84.5,
    schema: {
      title: "Customer CSAT & Product Feedback",
      fields: [
        { id: "f1", type: "text", label: "Full Name", placeholder: "Jane Doe", required: true },
        { id: "f2", type: "email", label: "Work Email Address", placeholder: "jane@company.com", required: true },
        { id: "f3", type: "rating", label: "Overall Product Satisfaction (1-5)", required: true, max: 5 },
        { 
          id: "f4", 
          type: "textarea", 
          label: "What specific features need improvement?", 
          placeholder: "Tell us what could be better...",
          required: false,
          conditional: { dependsOn: "f3", operator: "lessThanOrEqual", value: 3 }
        },
        { 
          id: "f5", 
          type: "select", 
          label: "Primary Role in Organization", 
          options: ["Software Engineer", "Product Manager", "DevOps / SRE", "Executive / Founder"],
          required: true 
        },
        { id: "f6", type: "checkbox", label: "I agree to participate in confidential beta testing", required: false }
      ]
    }
  },
  {
    id: "FORM-102",
    title: "Employee Equipment & Hardware Requisition",
    category: "Internal IT Operations",
    status: "PUBLISHED",
    submissionsCount: 580,
    completionRatePct: 92.0,
    schema: {
      title: "Employee Hardware Requisition",
      fields: [
        { id: "e1", type: "text", label: "Employee Name", required: true },
        { id: "e2", type: "select", label: "Laptop Architecture", options: ["MacBook Pro 16 M3 Max", "Dell XPS 15 64GB", "ThinkPad P1 Gen 6"], required: true },
        { id: "e3", type: "number", label: "External 4K Monitors Requested (1-3)", required: true, min: 1, max: 3 }
      ]
    }
  }
];
