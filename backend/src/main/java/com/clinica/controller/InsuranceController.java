package com.clinica.controller;

import com.clinica.model.response.InsuranceProvidersResponse;
import com.clinica.model.response.InsuranceProvidersResponse.InsuranceProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InsuranceController {

    private static final List<InsuranceProvider> PROVIDERS = List.of(
            new InsuranceProvider("Aetna", List.of(
                    "Aetna PPO", "Aetna HMO", "Aetna Choice POS II", "Aetna EPO",
                    "Aetna Open Access", "Aetna Medicare Advantage")),
            new InsuranceProvider("Anthem / Blue Cross Blue Shield", List.of(
                    "Anthem PPO", "Anthem HMO", "Anthem EPO", "Anthem Blue Preferred POS",
                    "Anthem Blue Choice HMO", "Anthem HealthKeepers")),
            new InsuranceProvider("Blue Cross Blue Shield (BCBS)", List.of(
                    "BCBS PPO", "BCBS HMO", "BCBS Blue Preferred POS", "BCBS Blue Choice HMO",
                    "BCBS High-Deductible (HDHP)", "BCBS Federal Employee Program")),
            new InsuranceProvider("Cigna", List.of(
                    "Cigna PPO", "Cigna HMO", "Cigna Open Access Plus", "Cigna Connect HMO",
                    "Cigna LocalPlus", "Cigna Medicare Advantage")),
            new InsuranceProvider("UnitedHealthcare", List.of(
                    "UHC Choice Plus PPO", "UHC Navigate HMO", "UHC Core",
                    "UHC Options PPO", "UHC Select Plus", "UHC Medicare Advantage")),
            new InsuranceProvider("Humana", List.of(
                    "Humana PPO", "Humana HMO", "Humana Gold Plus HMO",
                    "Humana Choice POS", "Humana Medicare Advantage", "Humana Dental/Vision")),
            new InsuranceProvider("Kaiser Permanente", List.of(
                    "Kaiser HMO", "Kaiser Bronze 60", "Kaiser Silver 70",
                    "Kaiser Gold 80", "Kaiser Senior Advantage")),
            new InsuranceProvider("Oscar Health", List.of(
                    "Oscar Simple", "Oscar Classic", "Oscar Secure", "Oscar Ultra")),
            new InsuranceProvider("Ambetter", List.of(
                    "Ambetter Essential Care", "Ambetter Balanced Care", "Ambetter Select Care")),
            new InsuranceProvider("Molina Healthcare", List.of(
                    "Molina Marketplace", "Molina Medicaid", "Molina Medicare")),
            new InsuranceProvider("WellCare", List.of(
                    "WellCare Classic HMO", "WellCare Value Plan", "WellCare Medicare Advantage")),
            new InsuranceProvider("Medicaid", List.of(
                    "Georgia Medicaid (Peach State Health)", "Georgia Medicaid (Amerigroup)",
                    "Georgia Medicaid (CareSource)", "Georgia Medicaid (Wellcare of Georgia)")),
            new InsuranceProvider("Medicare", List.of(
                    "Medicare Part A (Hospital)", "Medicare Part B (Medical)",
                    "Medicare Part C (Advantage)", "Medicare Part D (Prescription)")),
            new InsuranceProvider("TRICARE", List.of(
                    "TRICARE Prime", "TRICARE Select", "TRICARE For Life", "TRICARE Young Adult"))
    );

    @GetMapping("/insurance/providers")
    public ResponseEntity<InsuranceProvidersResponse> getProviders() {
        return ResponseEntity.ok(new InsuranceProvidersResponse(PROVIDERS));
    }
}
