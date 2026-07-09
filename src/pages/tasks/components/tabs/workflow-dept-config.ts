export interface DeptFieldMapping {
  workflowRole: string
  label: string
  enabledField: string
  reviewerIdField: string
}

export const DEPT_FIELD_MAPPINGS: Record<string, DeptFieldMapping> = {
  Relex: {
    workflowRole: 'Relex',
    label: 'Relex',
    enabledField: 'wf_relex',
    reviewerIdField: 'wf_relex_reviewer_id',
  },
  Legal: {
    workflowRole: 'Legal',
    label: 'Legal',
    enabledField: 'wf_legal',
    reviewerIdField: 'wf_legal_reviewer_id',
  },
  GoB: {
    workflowRole: 'Governing Bodies',
    label: 'Governing Bodies',
    enabledField: 'wf_gob',
    reviewerIdField: 'wf_gob_reviewer_id',
  },
  'Governing Bodies': {
    workflowRole: 'Governing Bodies',
    label: 'Governing Bodies',
    enabledField: 'wf_gob',
    reviewerIdField: 'wf_gob_reviewer_id',
  },
  Protocol: {
    workflowRole: 'Protocol',
    label: 'Protocol',
    enabledField: 'wf_protocol',
    reviewerIdField: 'wf_protocol_reviewer_id',
  },
  EMS: {
    workflowRole: 'EMS',
    label: 'EMS',
    enabledField: 'wf_ems',
    reviewerIdField: 'wf_ems_reviewer_id',
  },
  Procurement: {
    workflowRole: 'Procurement',
    label: 'Procurement',
    enabledField: 'wf_procurement',
    reviewerIdField: 'wf_procurement_reviewer_id',
  },
  Technology: {
    workflowRole: 'Technology',
    label: 'Technology',
    enabledField: 'wf_technology',
    reviewerIdField: 'wf_technology_reviewer_id',
  },
  'M&E': {
    workflowRole: 'M&E',
    label: 'M&E',
    enabledField: 'wf_mne',
    reviewerIdField: 'wf_mne_reviewer_id',
  },
  COMMS: {
    workflowRole: 'COMMS',
    label: 'Communications',
    enabledField: 'wf_comms',
    reviewerIdField: 'wf_comms_reviewer_id',
  },
  'Social Media': {
    workflowRole: 'Social Media',
    label: 'Social Media',
    enabledField: 'wf_social_media',
    reviewerIdField: 'wf_social_media_reviewer_id',
  },
  EOSG: {
    workflowRole: 'EOSG',
    label: 'EOSG',
    enabledField: 'wf_eosg',
    reviewerIdField: 'wf_eosg_reviewer_id',
  },
  OPS: {
    workflowRole: 'OPS',
    label: 'OPS',
    enabledField: 'wf_ops',
    reviewerIdField: 'wf_ops_reviewer_id',
  },
  Partnerships: {
    workflowRole: 'Partnerships',
    label: 'Partnerships',
    enabledField: 'wf_partnerships',
    reviewerIdField: 'wf_partnerships_reviewer_id',
  },
}
