package com.medapath.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    @NotNull
    private Long sessionId;

    @NotBlank
    private String message;
}
