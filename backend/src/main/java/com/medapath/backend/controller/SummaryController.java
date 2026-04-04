package com.medapath.backend.controller;

import com.medapath.backend.model.PatientSession;
import com.medapath.backend.model.SymptomAssessment;
import com.medapath.backend.repository.SymptomAssessmentRepository;
import com.medapath.backend.service.IntakeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class SummaryController {

    private final IntakeService intakeService;
    private final SymptomAssessmentRepository assessmentRepository;

    @GetMapping(value = "/{sessionId}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getSummary(@PathVariable Long sessionId) {
        PatientSession session = intakeService.getSession(sessionId);
        SymptomAssessment assessment = assessmentRepository.findTopBySessionIdOrderByCreatedAtDesc(sessionId);

        if (assessment == null) {
            return ResponseEntity.notFound().build();
        }

        String date = assessment.getCreatedAt() != null
                ? assessment.getCreatedAt().format(DateTimeFormatter.ofPattern("MMMM d, yyyy 'at' h:mm a"))
                : "N/A";

        String careType = assessment.getCareTypeSuggested() != null
                ? assessment.getCareTypeSuggested().replace("_", " ").substring(0, 1).toUpperCase()
                  + assessment.getCareTypeSuggested().replace("_", " ").substring(1)
                : "N/A";

        String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>MedaPath Analysis Report</title>
                  <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .header { border-bottom: 3px solid #2D6A4F; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { font-size: 28px; color: #2D6A4F; }
                    .header p { color: #666; margin-top: 4px; }
                    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
                    .badge-low { background: #d4edda; color: #155724; }
                    .badge-medium { background: #fff3cd; color: #856404; }
                    .badge-high { background: #f8d7da; color: #721c24; }
                    .badge-emergency { background: #721c24; color: white; }
                    .section { margin-bottom: 28px; }
                    .section h2 { font-size: 16px; color: #2D6A4F; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #e0e0e0; padding-bottom: 6px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                    .field { }
                    .field .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
                    .field .value { font-size: 15px; font-weight: 500; margin-top: 2px; }
                    .explanation { background: #f8f9fa; padding: 16px; border-radius: 8px; line-height: 1.6; font-size: 14px; }
                    .disclaimer { margin-top: 40px; padding: 16px; background: #fff3cd; border-radius: 8px; font-size: 12px; color: #856404; }
                    .footer { margin-top: 30px; text-align: center; color: #aaa; font-size: 11px; }
                    @media print { body { padding: 20px; } .no-print { display: none; } }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h1>MedaPath Analysis Report</h1>
                    <p>Generated on %s</p>
                  </div>

                  <div class="section">
                    <h2>Patient Information</h2>
                    <div class="grid">
                      <div class="field"><div class="label">Name</div><div class="value">%s %s</div></div>
                      <div class="field"><div class="label">Age</div><div class="value">%d</div></div>
                      <div class="field"><div class="label">ZIP Code</div><div class="value">%s</div></div>
                      <div class="field"><div class="label">Insurance</div><div class="value">%s %s</div></div>
                    </div>
                  </div>

                  <div class="section">
                    <h2>Symptoms Reported</h2>
                    <p style="line-height:1.6">%s</p>
                    <div class="grid" style="margin-top:12px">
                      <div class="field"><div class="label">Severity</div><div class="value">%s</div></div>
                      <div class="field"><div class="label">Duration</div><div class="value">%s</div></div>
                    </div>
                  </div>

                  <div class="section">
                    <h2>AI Analysis</h2>
                    <div class="grid" style="margin-bottom:12px">
                      <div class="field"><div class="label">Primary Concern</div><div class="value">%s</div></div>
                      <div class="field"><div class="label">Urgency</div><div class="value"><span class="badge badge-%s">%s</span></div></div>
                      <div class="field"><div class="label">Recommended Care</div><div class="value">%s</div></div>
                    </div>
                    <div class="explanation">
                      <strong>What's going on:</strong><br>%s
                    </div>
                    <div class="explanation" style="margin-top:12px">
                      <strong>Advice:</strong><br>%s
                    </div>
                  </div>

                  <div class="disclaimer">
                    <strong>Disclaimer:</strong> This report was generated by MedaPath's AI-powered triage system and is for informational purposes only.
                    It is NOT a medical diagnosis. Please consult a qualified healthcare provider for proper evaluation and treatment.
                  </div>

                  <div class="footer">
                    <p>MedaPath &mdash; AI-Powered Healthcare Navigation</p>
                  </div>
                </body>
                </html>
                """.formatted(
                date,
                session.getFirstName(), session.getLastName(),
                session.getAge(),
                session.getZipCode(),
                session.getInsuranceProvider(),
                session.getPlanName() != null ? "(" + session.getPlanName() + ")" : "",
                assessment.getSymptomText(),
                assessment.getSeverity(),
                assessment.getDuration(),
                assessment.getPrimaryCondition(),
                assessment.getUrgencyLevel(), assessment.getUrgencyLevel(),
                careType,
                assessment.getDetailedExplanation() != null ? assessment.getDetailedExplanation() : "N/A",
                assessment.getAdvice()
        );

        return ResponseEntity.ok(html);
    }
}
