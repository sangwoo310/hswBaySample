package com.nftbay.api.handler;

import com.nftbay.api.support.EnumSpecialDealType;
import com.nftbay.api.support.PageModel;
import com.nftbay.api.utils.PageUtils;
import com.nftbay.common.bidding.repositories.BiddingHistoryReactiveRepository;
import com.nftbay.common.trade.EnumNftType;
import com.nftbay.common.trade.EnumTradeState;
import com.nftbay.common.trade.models.TradeModel;
import com.nftbay.common.trade.repositories.TradeReactiveRepository;
import com.nftbay.common.trade.repositories.TradeRepository;
import com.nftbay.common.trade.services.TradeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.Calendar;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.BodyInserters.fromObject;
import static org.springframework.web.reactive.function.server.ServerResponse.*;

@Slf4j
@Component
public class NFTTradeHandler {

    private TradeService tradeService;

    private TradeReactiveRepository tradeReactiveRepository;

    private TradeRepository tradeRepository;

    private BiddingHistoryReactiveRepository biddingHistoryReactiveRepository;

    @Autowired
    public NFTTradeHandler(TradeService tradeService, TradeReactiveRepository tradeReactiveRepository, TradeRepository tradeRepository, BiddingHistoryReactiveRepository biddingHistoryReactiveRepository) {
        this.tradeService = tradeService;
        this.tradeReactiveRepository = tradeReactiveRepository;
        this.tradeRepository = tradeRepository;
        this.biddingHistoryReactiveRepository = biddingHistoryReactiveRepository;
    }

    public Mono<ServerResponse> getTradebyServiceId(ServerRequest request) {
        int serviceId = Integer.parseInt(request.pathVariable("serviceId"));
        String tokenType = request.queryParam("type").orElse(null);
        String query = request.queryParam("q").orElse(null);
        String suggest = request.queryParam("suggest").orElse(null);

        if (!StringUtils.isEmpty(tokenType)) {
            if (!StringUtils.isEmpty(query)) {
                return tradeReactiveRepository.getTradeByServiceIdAndStateAndNftAndBidEndTimeWithQuery(serviceId, EnumTradeState.SELLING, EnumNftType.valueOf(tokenType.toUpperCase()),
                    query, PageUtils.parsePageable(request))
                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
                        .body(fromObject(PageModel.of(page)))
                        .switchIfEmpty(noContent().build()));
            } else {
                return tradeReactiveRepository.getTradeByServiceIdAndStateAndNftAndBidEndTime(serviceId, EnumTradeState.SELLING, EnumNftType.valueOf(tokenType.toUpperCase()),
                    PageUtils.parsePageable(request))
                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
                        .body(fromObject(PageModel.of(page)))
                        .switchIfEmpty(noContent().build()));
            }
        } else {
            if (!StringUtils.isEmpty(query)) {
                return tradeReactiveRepository.getTradeByServiceIdAndStateAndBidEndTimeWithQuery(serviceId, EnumTradeState.SELLING, query, PageUtils.parsePageable(request))
                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
                        .body(fromObject(PageModel.of(page)))
                        .switchIfEmpty(noContent().build()));
            } else {
                return tradeReactiveRepository.getTradeByServiceIdAndStateAndBidEndTime(serviceId, EnumTradeState.SELLING, PageUtils.parsePageable(request))
                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
                        .body(fromObject(PageModel.of(page)))
                        .switchIfEmpty(noContent().build()));
            }
        }
    }

    public Mono<ServerResponse> getSpecialDeal(ServerRequest request) {
        int serviceId = Integer.parseInt(request.pathVariable("serviceId"));
        String specialDeal = request.queryParam("type").orElse(null);

        if (!StringUtils.isEmpty(specialDeal)) {
            EnumSpecialDealType specialDealType = EnumSpecialDealType.valueOf(specialDeal.toUpperCase());

            Mono<Page<TradeModel>> mono = null;

            if (specialDealType == EnumSpecialDealType.TODAY) {
                mono = tradeService.getTodaySpecialDeal(serviceId, PageUtils.parsePageable(request));
            } else if (specialDealType == EnumSpecialDealType.WEEK) {
                mono = tradeService.getWeekSpecialDeal(serviceId, PageUtils.parsePageable(request));
            } else if (specialDealType == EnumSpecialDealType.MONTH) {
                mono = tradeService.getMonthSpecialDeal(serviceId, PageUtils.parsePageable(request));
            }

            if (mono != null) {
                return mono
                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
                    .body(fromObject(PageModel.of(page)))
                    .switchIfEmpty(noContent().build()));
            }

            return noContent().build();
        } else {
            return badRequest().build();
        }
    }

    public Mono<ServerResponse> getNewDeal(ServerRequest request) {
        int serviceId = Integer.parseInt(request.pathVariable("serviceId"));

        return tradeService.getNewProducts(serviceId, PageUtils.parsePageable(request))
            .flatMap(page -> ok().contentType(APPLICATION_JSON)
                .body(fromObject(PageModel.of(page)))
                .switchIfEmpty(noContent().build()));
    }

    public Mono<ServerResponse> getDeadlineDeal(ServerRequest request) {
        int serviceId = Integer.parseInt(request.pathVariable("serviceId"));

        return tradeService.getDeadlineProducts(serviceId, PageUtils.parsePageable(request))
                .flatMap(page -> ok().contentType(APPLICATION_JSON)
                        .body(fromObject(PageModel.of(page)))
                        .switchIfEmpty(noContent().build()));
    }

    public Mono<ServerResponse> getMyTrades(ServerRequest request) {
        String accountName = request.pathVariable("accountName");
        String tradeType = request.queryParam("type").orElse(null);
        String tokenType = request.queryParam("token").orElse(null);
        String sig = request.queryParam("sig").orElse(null);
        String seed = request.queryParam("seed").orElse(null);
        String publicKey = request.queryParam("publicKey").orElse(null);

//        if (StringUtils.isEmpty(sig) || StringUtils.isEmpty(seed) || StringUtils.isEmpty(publicKey)) {
//            return badRequest().build();
//        }
        EnumNftType type = EnumNftType.valueOf(tokenType.toUpperCase());

        if ("selling".equalsIgnoreCase(tradeType)) {
            try {
                //return tradeService.getMyHistory(type, accountName, publicKey, sig, seed, PageUtils.parsePageable(request))
                return tradeReactiveRepository.getTradeHistoryBySellerAndNftType(accountName, type, PageUtils.parsePageable(request))
                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
                        .body(fromObject(PageModel.of(page)))
                        .switchIfEmpty(noContent().build()));
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        } else {
            try {
                //return tradeService.getMyHistory(type, accountName, publicKey, sig, seed, PageUtils.parsePageable(request))
                return biddingHistoryReactiveRepository.getBiddingHistoryByBidderAndNftType(accountName, type, PageUtils.parsePageable(request))
                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
                        .body(fromObject(PageModel.of(page)))
                        .switchIfEmpty(noContent().build()));
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }
//        if (!StringUtils.isEmpty(tradeType)) {
//            if ("sell".equals(tradeType.toLowerCase())) {
//                return tradeService.getMyOrders(accountName, publicKey, sig, seed, PageUtils.parsePageable(request))
//                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
//                        .body(fromObject(PageModel.of(page)))
//                        .switchIfEmpty(noContent().build()));
//            } else if ("bid".equals(tradeType.toLowerCase())) {
//                return tradeService.getMyBids(accountName, publicKey, sig, seed, PageUtils.parsePageable(request))
//                    .flatMap(page -> ok().contentType(APPLICATION_JSON)
//                        .body(fromObject(PageModel.of(page)))
//                        .switchIfEmpty(noContent().build()));
//            }
//        }

        return badRequest().build();
    }

    public Mono<ServerResponse> getTradeByTradeId(ServerRequest request) {
        int serviceId = Integer.parseInt(request.pathVariable("serviceId"));
        long tradeId = Long.parseLong(request.pathVariable("tradeId"));

        return Mono.fromCallable(() -> tradeRepository.findById(tradeId))
            .flatMap(trade -> ok().contentType(APPLICATION_JSON)
                .body(fromObject(trade))
                .switchIfEmpty(noContent().build()));
    }

    public Mono<ServerResponse> getMySelling(ServerRequest request) {
        String accountName = request.pathVariable("accountName");
        String tokenType = request.pathVariable("tokenType");
        String tokenId = request.pathVariable("tokenId");

        EnumNftType type = EnumNftType.valueOf(tokenType.toUpperCase());

        return tradeReactiveRepository.getSellerTradeByTokenId(accountName, type, Long.parseLong(tokenId))
            .flatMap(obj -> ok().contentType(APPLICATION_JSON)
                .body(fromObject(obj))
                .switchIfEmpty(noContent().build()));
    }

    public Mono<ServerResponse> getMyClaims(ServerRequest request) {
        String accountName = request.pathVariable("accountName");
        String tokenType = request.pathVariable("tokenType");

        EnumNftType type = EnumNftType.valueOf(tokenType.toUpperCase());

        return tradeReactiveRepository.getBuyerClaimNft(accountName, type)
            .flatMap(obj -> ok().contentType(APPLICATION_JSON)
                .body(fromObject(obj))
                .switchIfEmpty(noContent().build()));
    }
}
