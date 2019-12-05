package com.nftbay.api.support;

import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PageModel {

    private int totalPages;
    private long totalElements;
    private boolean last;
    private int page;
    private int pageSize;
    private List<Object> contents;

    public static PageModel of(Page page) {
        return PageModel.builder()
            .totalPages(page.getTotalPages())
            .totalElements(page.getTotalElements())
            .last(page.isLast())
            .page(page.getNumber())
            .pageSize(page.getSize())
            .contents(page.getContent())
            .build();
    }
}
