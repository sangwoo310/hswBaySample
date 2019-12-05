package com.nftbay.batch.monitoring;

import com.google.gson.Gson;
import org.springframework.batch.core.BatchStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.BaseSubscriber;
import reactor.core.scheduler.Schedulers;

import java.util.Collections;

@Component
public class SlackClient {

    @Value("${slack.service_id}")
    private String serviceId;

    @Value("${slack.monitoring_channel}")
    private String monitoringChannelId;

    @Value("${slack.token}")
    private String token;

    @Value("${slack.prefix}")
    private String prefix;

    private SlackApi slackApi;

    @Autowired
    public void setSlackApi(SlackApi slackApi) {
        this.slackApi = slackApi;
    }

    public void sendMsg(BatchStatus status, String title, String msg) {
        SlackAttachment attachment = SlackAttachment.builder()
            .color(BatchStatus.COMPLETED.equals(status) ? "good" : "danger").title(msg)
            .pretext(prefix + " ::" + status.name()).build();

        SlackMessage message =
            SlackMessage.builder().text(title).attachments(Collections.singletonList(attachment)).build();

        Gson gson = new Gson();
        gson.toJson(message);

        slackApi.sendMessage(serviceId, monitoringChannelId, token, message)
            .subscribeOn(Schedulers.parallel()).subscribe(new BaseSubscriber<Void>() {
        });
    }
}
