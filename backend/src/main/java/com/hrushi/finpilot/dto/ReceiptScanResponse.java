package com.hrushi.finpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiptScanResponse {

    private String merchant;
    private String receiptNumber;
    private String date;
    private Double subtotal;
    private Double tax;
    private Double total;
    private String currency;
    private String paymentMethod;
    private String category;

    @Builder.Default
    private List<ReceiptItem> items = new ArrayList<>();

    private String rawText;
}
