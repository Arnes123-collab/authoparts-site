export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  createdAt: string;
}

export interface LeadNoteDbRow {
  id: string;
  lead_id: string;
  note: string;
  created_at: string;
}

export function mapLeadNoteFromDb(row: LeadNoteDbRow): LeadNote {
  return {
    id: row.id,
    leadId: row.lead_id,
    note: row.note,
    createdAt: row.created_at,
  };
}
