import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  styles: [`
    :host { font-family: "Times New Roman", serif; line-height: 1.4; color: #000; display: block; padding: 40px; }
    .container { max-width: 900px; margin: auto; border: 1px solid #000; padding: 20px; }
    .header { margin-bottom: 20px; }
    .instruction-box { border: 1px solid #000; padding: 10px; margin-bottom: 20px; font-size: 0.9rem; }
    .section-header { background-color: #f2f2f2; font-weight: bold; padding: 5px; border: 1px solid #000; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
    th, td { border: 1px solid #000; padding: 8px; vertical-align: top; text-align: left; font-size: 0.9rem; }
    input[type="text"], textarea { width: 98%; border: none; font-family: "Times New Roman", serif; font-size: inherit; background: transparent; outline: none; resize: vertical; }
    input[type="text"]:focus, textarea:focus { background: #fffde7; }
    .signature-line { border-bottom: 1px solid #000; width: 300px; display: inline-block; margin-top: 20px; }
    .nested-table { margin: 0; width: 100%; }
    .nested-table td { border: 1px solid #ccc; }
    .action-bar { max-width: 900px; margin: 16px auto 0; display: flex; gap: 10px; }
    .btn { padding: 8px 20px; font-family: "Times New Roman", serif; font-size: 0.9rem; cursor: pointer; border: 1px solid #000; background: #fff; }
    .btn-primary { background: #1F4E79; color: #fff; border-color: #1F4E79; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .msg-success { color: green; font-size: 0.85rem; }
    .msg-error { color: red; font-size: 0.85rem; }
  `],
  template: `
    <app-spinner *ngIf="checklistLoading" message="Loading checklist..." />

    <div *ngIf="!checklistLoading" class="container">

      <!-- Read-only banner -->
      <div *ngIf="isReadOnly" style="background:#fff3cd;border:1px solid #ffc107;padding:10px;margin-bottom:16px;font-size:0.9rem;">
        <strong>Read-only.</strong>
        This checklist has been submitted and cannot be edited.
        <span *ngIf="applicationStatus === 'compliance_directive_issued'"> A compliance directive has been issued — you may now edit the affected sections.</span>
      </div>

      <div class="header" style="text-align:center;margin-bottom:20px;">
        <img src="nafdac.png" alt="NAFDAC Logo" style="height:90px;width:auto;object-fit:contain;display:block;margin:0 auto 10px;" />
        <div style="font-weight:bold;font-size:1rem;">NAFDAC BIOEQUIVALENCE STUDY REPORT SUBMISSION CHECKLIST</div>
      </div>

      <div class="instruction-box">
        <strong>General Instructions</strong><br>
        Please submit this checklist together with the bioequivalence study report (including all appendices) and the bioequivalence trial information form (BTIF) for product screening and evaluation.<br>
        Provide/fill in as much detailed, accurate and final information as possible.<br>
        All the appended documents should be clearly identifiable by their location and tagging of the file names.<br>
        Kindly check that you have signed on the checklist, provided all requested information and enclosed all requested documents.<br>
        Should you have any queries regarding this procedure or the checklist, kindly contact Drug Evaluation and Research Directorate (DER) via e-mail der.headquarters&#64;nafdac.gov.ng or registration&#64;nafdac.gov.ng<br><br>
        <strong>*Reminder:</strong><br>
        Please be informed that all data submitted to support the registration application for this product will be subjected to further evaluation.<br>
        Please refrain from changing/removing all submitted data unless requested by NAFDAC or the data has been updated as per latest registration requirements.<br>
        Kindly be reminded that decision whether the dossier is allowed for registration will be subjected to full evaluation and the final decision by NAFDAC.
      </div>

      <form [formGroup]="form" (ngSubmit)="save()">

        <p>I, the undersigned, certify, that the information provided in this application and the attached documents is correct and true.</p>

        <p>Signed on behalf of:</p>
        <div><input type="text" class="signature-line" formControlName="signedOnBehalfOf" placeholder="(Market Authorisation Holder)"></div><br>
        <div><input type="text" class="signature-line" formControlName="signatoryNameAndTitle" placeholder="(Name &amp; Title)"></div><br>
        <div><input type="text" class="signature-line" formControlName="certificationDate" placeholder="(Date)"></div>

        <div class="section-header">Bioequivalence Study Information</div>
        <p>(Please fill in the following information)</p>

        <table>
          <tr>
            <td style="width:5%">1.</td>
            <td style="width:45%">Study number/ study protocol number</td>
            <td><input type="text" formControlName="studyProtocolNumber"></td>
          </tr>
          <tr>
            <td>2.</td>
            <td>Study title</td>
            <td><textarea formControlName="studyTitle" rows="3"></textarea></td>
          </tr>
          <tr>
            <td>3.</td>
            <td>Start and end dates for each period of the clinical study</td>
            <td>
              <table class="nested-table">
                <tr>
                  <th>Study period</th>
                  <th>Start date</th>
                  <th>End date</th>
                </tr>
                <ng-container formArrayName="studyPeriods">
                  <tr *ngFor="let period of studyPeriods.controls; let i = index" [formGroupName]="i">
                    <td>{{ period.get('periodLabel')?.value }}</td>
                    <td><input type="text" formControlName="startDate"></td>
                    <td><input type="text" formControlName="endDate"></td>
                  </tr>
                </ng-container>
              </table>
            </td>
          </tr>
          <tr>
            <td>4.</td>
            <td>Start and end date for bio-analytical study</td>
            <td><input type="text" formControlName="bioanalyticalStudyDates"></td>
          </tr>
          <tr>
            <td>5.</td>
            <td>Clinical Study facility (Name and full address of clinical study site)</td>
            <td><textarea formControlName="clinicalStudySite" rows="2"></textarea></td>
          </tr>
          <tr>
            <td>6.</td>
            <td>Bio-analytical facility (Name and full address of bioanalytical study site)</td>
            <td><textarea formControlName="bioanalyticalStudySite" rows="2"></textarea></td>
          </tr>
          <tr>
            <td>7.</td>
            <td colspan="2">
              <strong>Institutional Review Board/ Independent Ethical Committee</strong><br>
              Name &amp; address of the ethics committee: <input type="text" formControlName="ethicsCommitteeNameAndAddress"><br><br>
              Approval date of study protocol (together with study protocol number and version): <input type="text" formControlName="studyProtocolApprovalInfo"><br><br>
              Approval date of informed consent form: <input type="text" formControlName="informedConsentApprovalDate">
            </td>
          </tr>
          <tr>
            <td>8.</td>
            <td colspan="2">
              <strong>Relevant information on the test product used in the BE study</strong><br>
              Product name: <input type="text" formControlName="testProductName"><br>
              Strength (*Please indicate whether the test product used has the same strength as product proposed for registration): <input type="text" formControlName="testProductStrength"><br>
              Dosage form: <input type="text" formControlName="testProductDosageForm"><br>
              Batch number: <input type="text" formControlName="testProductBatchNumber"><br>
              Batch size: <input type="text" formControlName="testProductBatchSize"><br>
              Manufacture date: <input type="text" formControlName="testProductManufactureDate"><br>
              Expiry date: <input type="text" formControlName="testProductExpiryDate"><br>
              Name and full address of the drug substance (API) manufacturing site: <textarea formControlName="apiManufacturingSiteNameAndAddress" rows="2"></textarea><br>
              Name and full address of the test product manufacturing site (*Please indicate whether the test product used has the same qualitative and quantitative composition as the product proposed for registration): <textarea formControlName="testProductManufacturingSiteNameAndAddress" rows="2"></textarea>
            </td>
          </tr>
          <tr>
            <td>9.</td>
            <td colspan="2">
              <strong>Relevant information on the reference product used in the BE study</strong><br>
              Product name: <input type="text" formControlName="referenceProductName"><br>
              Strength: <input type="text" formControlName="referenceProductStrength"><br>
              Dosage form: <input type="text" formControlName="referenceProductDosageForm"><br>
              Batch number: <input type="text" formControlName="referenceProductBatchNumber"><br>
              Expiry date: <input type="text" formControlName="referenceProductExpiryDate"><br>
              Country where the product is sourced from: <input type="text" formControlName="referenceProductSourceCountry"><br>
              Name and full address of the reference product manufacturing site (*Please indicate whether the reference product is the same as WHO Comparator Product. If NO, please provide document no. 3 &amp; 5 under section B. (Documents to be submitted).): <textarea formControlName="referenceProductManufacturingSiteNameAndAddress" rows="2"></textarea>
            </td>
          </tr>
          <tr>
            <td>10.</td>
            <td colspan="2">
              <strong>Summary results of the study</strong>
              <table class="nested-table">
                <tr>
                  <th>Parameter Logarithmic transformed data</th>
                  <th>Test (Geometric mean)</th>
                  <th>Reference (Geometric mean)</th>
                  <th>% Ratio of geometric means</th>
                  <th>90% Confidence interval</th>
                  <th>Intra-subject coefficient of variation, ISCV (%)</th>
                </tr>
                <ng-container formArrayName="summaryResults">
                  <tr *ngFor="let r of summaryResults.controls; let i = index" [formGroupName]="i">
                    <td>{{ r.get('parameter')?.value }}</td>
                    <td><input type="text" formControlName="testGeometricMean"></td>
                    <td><input type="text" formControlName="referenceGeometricMean"></td>
                    <td><input type="text" formControlName="percentageRatioGeometricMeans"></td>
                    <td><input type="text" formControlName="confidenceInterval"></td>
                    <td><input type="text" formControlName="intraSubjectCoefficientVariationIscv"></td>
                  </tr>
                </ng-container>
              </table>
            </td>
          </tr>
        </table>

        <div class="section-header">Documents to be submitted</div>
        <p>(Please tag/state the name and location of the documents in the dossier)</p>

        <table>
          <tr>
            <th>No.</th>
            <th>Documents</th>
            <th>Name of document and location</th>
          </tr>
          <ng-container formArrayName="documentReferences">
            <tr *ngFor="let ref of documentReferences.controls; let i = index" [formGroupName]="i">
              <td style="width:5%">{{ ref.get('itemNumber')?.value }}.</td>
              <td style="width:50%" [innerHTML]="ref.get('documentTitle')?.value"></td>
              <td><input type="text" formControlName="nameOfDocumentAndLocation"></td>
            </tr>
          </ng-container>
        </table>

      </form>
    </div>

    <!-- Action bar outside the container -->
    <div class="action-bar" *ngIf="!checklistLoading && !isReadOnly">
      <button class="btn btn-primary" (click)="save()" [disabled]="saving">
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
      <button class="btn" (click)="submitApplication()" [disabled]="submitting">
        {{ submitting ? 'Submitting...' : 'Submit Application' }}
      </button>
      <button class="btn" (click)="exportDocx()">Export as DOCX</button>
      <span *ngIf="saved" class="msg-success">Saved ✓</span>
      <span *ngIf="submitSuccess" class="msg-success">Submitted successfully!</span>
      <span *ngIf="submitError" class="msg-error">{{ submitError }}</span>
    </div>
  `,
})
export class ChecklistComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @Input() applicationStatus = '';
  @Input() set appId(id: string) {
    if (id) this.applicationId = id;
  }

  applicationId = '';
  checklistLoading = true;
  saving = false;
  saved = false;
  submitting = false;
  submitError = '';
  submitSuccess = false;

  form = this.fb.group({
    // Certification
    signedOnBehalfOf: [''],
    signatoryNameAndTitle: [''],
    certificationDate: [''],
    // Section A
    studyProtocolNumber: [''],
    studyTitle: [''],
    bioanalyticalStudyDates: [''],
    clinicalStudySite: [''],
    bioanalyticalStudySite: [''],
    ethicsCommitteeNameAndAddress: [''],
    studyProtocolApprovalInfo: [''],
    informedConsentApprovalDate: [''],
    // Test product
    testProductName: [''],
    testProductStrength: [''],
    testProductDosageForm: [''],
    testProductBatchNumber: [''],
    testProductBatchSize: [''],
    testProductManufactureDate: [''],
    testProductExpiryDate: [''],
    apiManufacturingSiteNameAndAddress: [''],
    testProductManufacturingSiteNameAndAddress: [''],
    // Reference product
    referenceProductName: [''],
    referenceProductStrength: [''],
    referenceProductDosageForm: [''],
    referenceProductBatchNumber: [''],
    referenceProductExpiryDate: [''],
    referenceProductSourceCountry: [''],
    referenceProductManufacturingSiteNameAndAddress: [''],
    // Arrays
    studyPeriods: this.fb.array([]),
    summaryResults: this.fb.array([]),
    documentReferences: this.fb.array([]),
  });

  get studyPeriods() { return this.form.get('studyPeriods') as FormArray; }
  get summaryResults() { return this.form.get('summaryResults') as FormArray; }
  get documentReferences() { return this.form.get('documentReferences') as FormArray; }

  get isReadOnly(): boolean {
    const editableStatuses = ['draft', 'compliance_directive_issued', ''];
    return !editableStatuses.includes(this.applicationStatus);
  }

  ngOnInit() {
    if (!this.applicationId) {
      this.applicationId = this.route.snapshot.paramMap.get('applicationId') ?? '';
    }
    if (!this.applicationId) { this.checklistLoading = false; return; }

    this.api.getChecklist(this.applicationId).subscribe(({ checklist, studyPeriods, summaryResults, documentReferences }) => {

      this.form.patchValue({
        signedOnBehalfOf: checklist.signedOnBehalfOf ?? '',
        signatoryNameAndTitle: checklist.signatoryNameAndTitle ?? '',
        certificationDate: checklist.certificationDate ?? '',
        studyProtocolNumber: checklist.studyProtocolNumber ?? '',
        studyTitle: checklist.studyTitle ?? '',
        // Combine bioanalytical start/end into single field to match official form
        bioanalyticalStudyDates: [checklist.bioanalyticalStudyStartDate, checklist.bioanalyticalStudyEndDate]
          .filter(Boolean).join(' to '),
        // Combine clinical site name + address
        clinicalStudySite: [checklist.clinicalStudySiteName, checklist.clinicalStudySiteAddress]
          .filter(Boolean).join(', '),
        // Combine bioanalytical site name + address
        bioanalyticalStudySite: [checklist.bioanalyticalStudySiteName, checklist.bioanalyticalStudySiteAddress]
          .filter(Boolean).join(', '),
        // Combine ethics committee name + address
        ethicsCommitteeNameAndAddress: [checklist.ethicsCommitteeName, checklist.ethicsCommitteeAddress]
          .filter(Boolean).join(', '),
        // Combine protocol approval date + number/version
        studyProtocolApprovalInfo: [checklist.studyProtocolApprovalDate, checklist.approvedStudyProtocolNumberAndVersion]
          .filter(Boolean).join(' — '),
        informedConsentApprovalDate: checklist.informedConsentApprovalDate ?? '',
        testProductName: checklist.testProductName ?? '',
        testProductStrength: checklist.testProductStrength ?? '',
        testProductDosageForm: checklist.testProductDosageForm ?? '',
        testProductBatchNumber: checklist.testProductBatchNumber ?? '',
        testProductBatchSize: checklist.testProductBatchSize ?? '',
        testProductManufactureDate: checklist.testProductManufactureDate ?? '',
        testProductExpiryDate: checklist.testProductExpiryDate ?? '',
        apiManufacturingSiteNameAndAddress: checklist.apiManufacturingSiteNameAndAddress ?? '',
        testProductManufacturingSiteNameAndAddress: checklist.testProductManufacturingSiteNameAndAddress ?? '',
        referenceProductName: checklist.referenceProductName ?? '',
        referenceProductStrength: checklist.referenceProductStrength ?? '',
        referenceProductDosageForm: checklist.referenceProductDosageForm ?? '',
        referenceProductBatchNumber: checklist.referenceProductBatchNumber ?? '',
        referenceProductExpiryDate: checklist.referenceProductExpiryDate ?? '',
        referenceProductSourceCountry: checklist.referenceProductSourceCountry ?? '',
        referenceProductManufacturingSiteNameAndAddress: checklist.referenceProductManufacturingSiteNameAndAddress ?? '',
      });

      studyPeriods.forEach((p) => this.studyPeriods.push(this.fb.group({
        id: [p.id],
        periodLabel: [p.periodLabel],
        startDate: [p.startDate ?? ''],
        endDate: [p.endDate ?? ''],
        sortOrder: [p.sortOrder],
      })));

      summaryResults.forEach((r) => this.summaryResults.push(this.fb.group({
        id: [r.id],
        parameter: [r.parameter],
        testGeometricMean: [r.testGeometricMean ?? ''],
        referenceGeometricMean: [r.referenceGeometricMean ?? ''],
        percentageRatioGeometricMeans: [r.percentageRatioGeometricMeans ?? ''],
        // Combine CI lower/upper into single field to match official form
        confidenceInterval: [
          r.confidenceIntervalLower && r.confidenceIntervalUpper
            ? `${r.confidenceIntervalLower} – ${r.confidenceIntervalUpper}`
            : '',
        ],
        intraSubjectCoefficientVariationIscv: [r.intraSubjectCoefficientVariationIscv ?? ''],
        sortOrder: [r.sortOrder],
      })));

      documentReferences.forEach((d) => this.documentReferences.push(this.fb.group({
        id: [d.id],
        itemNumber: [d.itemNumber],
        documentTitle: [d.documentTitle],
        nameOfDocumentAndLocation: [d.nameOfDocumentAndLocation ?? ''],
      })));

      if (this.isReadOnly) {
        this.form.disable();
      } else {
        this.form.enable();
      }
      this.checklistLoading = false;
    });
  }

  save() {
    this.saving = true;
    this.saved = false;
    const v = this.form.value;

    // Split combined fields back for storage
    const bioanalyticalParts = (v.bioanalyticalStudyDates ?? '').split(' to ');
    const clinicalParts = (v.clinicalStudySite ?? '').split(', ');
    const bioParts = (v.bioanalyticalStudySite ?? '').split(', ');
    const ethicsParts = (v.ethicsCommitteeNameAndAddress ?? '').split(', ');
    const protocolParts = (v.studyProtocolApprovalInfo ?? '').split(' — ');

    const checklistPayload = {
      signedOnBehalfOf: v.signedOnBehalfOf,
      signatoryNameAndTitle: v.signatoryNameAndTitle,
      certificationDate: v.certificationDate,
      studyProtocolNumber: v.studyProtocolNumber,
      studyTitle: v.studyTitle,
      bioanalyticalStudyStartDate: bioanalyticalParts[0]?.trim() || null,
      bioanalyticalStudyEndDate: bioanalyticalParts[1]?.trim() || null,
      clinicalStudySiteName: clinicalParts[0]?.trim() || null,
      clinicalStudySiteAddress: clinicalParts.slice(1).join(', ').trim() || null,
      bioanalyticalStudySiteName: bioParts[0]?.trim() || null,
      bioanalyticalStudySiteAddress: bioParts.slice(1).join(', ').trim() || null,
      ethicsCommitteeName: ethicsParts[0]?.trim() || null,
      ethicsCommitteeAddress: ethicsParts.slice(1).join(', ').trim() || null,
      studyProtocolApprovalDate: protocolParts[0]?.trim() || null,
      approvedStudyProtocolNumberAndVersion: protocolParts[1]?.trim() || null,
      informedConsentApprovalDate: v.informedConsentApprovalDate,
      testProductName: v.testProductName,
      testProductStrength: v.testProductStrength,
      testProductDosageForm: v.testProductDosageForm,
      testProductBatchNumber: v.testProductBatchNumber,
      testProductBatchSize: v.testProductBatchSize,
      testProductManufactureDate: v.testProductManufactureDate,
      testProductExpiryDate: v.testProductExpiryDate,
      apiManufacturingSiteNameAndAddress: v.apiManufacturingSiteNameAndAddress,
      testProductManufacturingSiteNameAndAddress: v.testProductManufacturingSiteNameAndAddress,
      referenceProductName: v.referenceProductName,
      referenceProductStrength: v.referenceProductStrength,
      referenceProductDosageForm: v.referenceProductDosageForm,
      referenceProductBatchNumber: v.referenceProductBatchNumber,
      referenceProductExpiryDate: v.referenceProductExpiryDate,
      referenceProductSourceCountry: v.referenceProductSourceCountry,
      referenceProductManufacturingSiteNameAndAddress: v.referenceProductManufacturingSiteNameAndAddress,
    };

    // Split CI back into lower/upper
    const summaryPayload = (v.summaryResults as any[]).map((r) => {
      const ciParts = (r.confidenceInterval ?? '').split('–').map((s: string) => s.trim());
      return {
        id: r.id,
        testGeometricMean: r.testGeometricMean,
        referenceGeometricMean: r.referenceGeometricMean,
        percentageRatioGeometricMeans: r.percentageRatioGeometricMeans,
        confidenceIntervalLower: ciParts[0] || null,
        confidenceIntervalUpper: ciParts[1] || null,
        intraSubjectCoefficientVariationIscv: r.intraSubjectCoefficientVariationIscv,
      };
    });

    const docRefPayload = (v.documentReferences as any[]).map((d) => ({
      id: d.id,
      nameOfDocumentAndLocation: d.nameOfDocumentAndLocation,
    }));

    const studyPeriodPayload = (v.studyPeriods as any[]).map((p) => ({
      id: p.id, periodLabel: p.periodLabel,
      startDate: p.startDate || null, endDate: p.endDate || null, sortOrder: p.sortOrder,
    }));

    this.api.patchChecklist(this.applicationId, checklistPayload).subscribe();
    this.api.putStudyPeriods(this.applicationId, studyPeriodPayload).subscribe();
    this.api.putSummaryResults(this.applicationId, summaryPayload).subscribe();
    this.api.putDocumentReferences(this.applicationId, docRefPayload).subscribe({
      next: () => { this.saving = false; this.saved = true; setTimeout(() => (this.saved = false), 3000); },
      error: () => (this.saving = false),
    });
  }

  submitApplication() {
    this.submitting = true;
    this.submitError = '';
    this.api.submitApplication(this.applicationId).subscribe({
      next: () => {
        this.submitSuccess = true;
        setTimeout(() => this.router.navigate(['/my-applications']), 1500);
      },
      error: (e) => { this.submitError = e.error?.message ?? 'Submission failed'; this.submitting = false; },
    });
  }

  exportDocx() {
    this.api.exportChecklistDocx(this.applicationId).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checklist-${this.applicationId}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
