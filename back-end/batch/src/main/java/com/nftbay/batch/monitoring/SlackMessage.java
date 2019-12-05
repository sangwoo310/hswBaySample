package com.nftbay.batch.monitoring;

import com.google.gson.annotations.Expose;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SlackMessage {

    @Expose
    private String text;

    @Expose
    private List<SlackAttachment> attachments;
}
