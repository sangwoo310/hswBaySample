package com.nftbay.batch.monitoring;

import reactor.core.publisher.Mono;
import retrofit2.http.Body;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface SlackApi {

    @POST("/services/{serviceId}/{channelId}/{token}")
    Mono<Void> sendMessage(@Path("serviceId") String serviceId, @Path("channelId") String channelId,
        @Path("token") String token, @Body SlackMessage message);
}
