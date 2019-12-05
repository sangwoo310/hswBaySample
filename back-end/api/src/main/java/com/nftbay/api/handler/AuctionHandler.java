package com.nftbay.api.handler;

import com.nftbay.api.support.PageModel;
import com.nftbay.api.utils.PageUtils;
import com.nftbay.common.bidding.repositories.BiddingHistoryReactiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.BodyInserters.fromObject;
import static org.springframework.web.reactive.function.server.ServerResponse.*;

@Component
public class AuctionHandler {

    private BiddingHistoryReactiveRepository auctionReactiveRepository;

    @Autowired
    public AuctionHandler(BiddingHistoryReactiveRepository auctionReactiveRepository) {
        this.auctionReactiveRepository = auctionReactiveRepository;
    }

    public Mono<ServerResponse> getBids(ServerRequest request) {
        String tradeId = request.queryParam("tradeId").orElse(null);

        if (!StringUtils.isEmpty(tradeId)) {
            return auctionReactiveRepository.getBiddingHistoryByTradeId(Long.valueOf(tradeId), PageUtils.parsePageable(request))
                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
                            .body(fromObject(PageModel.of(page)))
                            .switchIfEmpty(notFound().build()));
        }

        return badRequest().build();
    }
}
