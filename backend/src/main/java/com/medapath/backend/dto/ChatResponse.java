package com.medapath.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {

    private String reply;
    private List<MessageDto> history;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageDto {
        private String role;
        private String content;
        private String timestamp;
    }
}
