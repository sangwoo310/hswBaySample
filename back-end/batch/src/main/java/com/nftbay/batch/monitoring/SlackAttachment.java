package com.nftbay.batch.monitoring;

import com.google.gson.annotations.Expose;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SlackAttachment {

    @Expose
    private String title;
    @Expose
    private String titleLink;
    @Expose
    private String fallback;
    @Expose
    private String callback_id;
    @Expose
    private String text;
    @Expose
    private String pretext;
    @Expose
    private String thumb_url;
    @Expose
    private String author_name;
    @Expose
    private String author_link;
    @Expose
    private String author_icon;
    @Expose
    private String footer;
    @Expose
    private String footer_icon;
    @Expose
    private String image_url;
    @Expose
    private String color;
    @Expose
    private Long timestamp;
}
