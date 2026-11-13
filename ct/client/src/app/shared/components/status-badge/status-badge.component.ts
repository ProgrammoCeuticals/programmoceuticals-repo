import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  draft:                                    { label: 'Draft',                        classes: 'bg-gray-100 text-gray-700' },
  submitted:                                { label: 'Submitted',                    classes: 'bg-blue-100 text-blue-700' },
  under_admin_screening:                    { label: 'Under Screening',              classes: 'bg-yellow-100 text-yellow-700' },
  compliance_directive_issued:              { label: 'Compliance Directive Issued',  classes: 'bg-orange-100 text-orange-700' },
  resubmitted_after_compliance_directive:   { label: 'Resubmitted',                 classes: 'bg-blue-100 text-blue-700' },
  classified:                               { label: 'Classified',                   classes: 'bg-purple-100 text-purple-700' },
  assigned_first_assessor:                  { label: 'Assigned to First Assessor',  classes: 'bg-indigo-100 text-indigo-700' },
  first_assessment_ongoing:                 { label: 'First Assessment Ongoing',    classes: 'bg-indigo-100 text-indigo-700' },
  first_assessment_reverted:                { label: 'First Assessment Reverted',   classes: 'bg-red-100 text-red-700' },
  assigned_second_assessor:                 { label: 'Assigned to Second Assessor', classes: 'bg-indigo-100 text-indigo-700' },
  second_assessment_ongoing:                { label: 'Second Assessment Ongoing',   classes: 'bg-indigo-100 text-indigo-700' },
  second_assessment_reverted:               { label: 'Second Assessment Reverted',  classes: 'bg-red-100 text-red-700' },
  awaiting_final_decision:                  { label: 'Awaiting Final Decision',     classes: 'bg-yellow-100 text-yellow-700' },
  finalized:                                { label: 'Finalized',                   classes: 'bg-green-100 text-green-700' },
  archived:                                 { label: 'Archived',                    classes: 'bg-gray-100 text-gray-500' },
  Pending:   { label: 'Pending',   classes: 'bg-gray-100 text-gray-700' },
  Ongoing:   { label: 'Ongoing',   classes: 'bg-blue-100 text-blue-700' },
  Completed: { label: 'Completed', classes: 'bg-green-100 text-green-700' },
  CD:       { label: 'CD',       classes: 'bg-orange-100 text-orange-700' },
  Approved: { label: 'Approved', classes: 'bg-green-100 text-green-700' },
  Rejected: { label: 'Rejected', classes: 'bg-red-100 text-red-700' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="config.classes">{{ config.label }}</span>
  `,
})
export class StatusBadgeComponent {
  @Input() status = '';
  get config() {
    return STATUS_CONFIG[this.status] ?? { label: this.status, classes: 'bg-gray-100 text-gray-600' };
  }
}
