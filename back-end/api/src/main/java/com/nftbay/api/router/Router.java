package com.nftbay.api.router;

import com.nftbay.api.handler.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration
public class Router {

    private NFTServiceHandler nftServiceHandler;
    private NFTTradeHandler nftTradeHandler;
    private AuctionHandler auctionHandler;
    private NoticeHandler noticeHandler;
    private GameHandler gameHandler;
    private ServerStateHandler serverStateHandler;

    @Autowired
    public Router(NFTServiceHandler nftServiceHandler, NFTTradeHandler nftTradeHandler, AuctionHandler auctionHandler,
            NoticeHandler noticeHandler, GameHandler gameHandler, ServerStateHandler serverStateHandler) {
        this.nftServiceHandler = nftServiceHandler;
        this.nftTradeHandler = nftTradeHandler;
        this.auctionHandler = auctionHandler;
        this.noticeHandler = noticeHandler;
        this.gameHandler = gameHandler;
        this.serverStateHandler = serverStateHandler;
    }

    @Bean
    public RouterFunction<ServerResponse> route() {
        return RouterFunctions
                .route(GET("/api/v1/services").and(accept(MediaType.APPLICATION_JSON)), nftServiceHandler::getServices)
                .andRoute(GET("/api/v1/services/{serviceId}/trades").and(accept(MediaType.APPLICATION_JSON)), nftTradeHandler::getTradebyServiceId)
                .andRoute(GET("/api/v1/services/{serviceId}/trades/special").and(accept(MediaType.APPLICATION_JSON)), nftTradeHandler::getSpecialDeal)
                .andRoute(GET("/api/v1/services/{serviceId}/trades/new").and(accept(MediaType.APPLICATION_JSON)), nftTradeHandler::getNewDeal)
                .andRoute(GET("/api/v1/services/{serviceId}/trades/deadline").and(accept(MediaType.APPLICATION_JSON)), nftTradeHandler::getDeadlineDeal)
                .andRoute(GET("/api/v1/services/{serviceId}/trades/{tradeId}").and(accept(MediaType.APPLICATION_JSON)), nftTradeHandler::getTradeByTradeId)
                .andRoute(GET("/api/v1/services/{serviceId}/trades/{orderId}/bids").and(accept(MediaType.APPLICATION_JSON)), auctionHandler::getBids)
                .andRoute(GET("/api/v1/trades/{accountName}").and(accept(MediaType.APPLICATION_JSON)), nftTradeHandler::getMyTrades)
                .andRoute(GET("/api/v1/trades/{accountName}/{tokenType}/claims").and(accept(MediaType.APPLICATION_JSON)), nftTradeHandler::getMyClaims)
                .andRoute(GET("/api/v1/trades/{accountName}/{tokenType}/{tokenId}").and(accept(MediaType.APPLICATION_JSON)), nftTradeHandler::getMySelling)
                .andRoute(GET("/api/v1/notices").and(accept(MediaType.APPLICATION_JSON)), noticeHandler::getNotice)
                .andRoute(GET("/api/v1/services/{serviceId}/products").and(accept(MediaType.APPLICATION_JSON)), gameHandler::searchProducts)
                .andRoute(GET("/api/v1/services/{serviceId}/products/{productType}/{productId}").and(accept(MediaType.APPLICATION_JSON)), gameHandler::getProduct)
                .andRoute(GET("/api/v1/services/{serviceId}/rankings").and(accept(MediaType.APPLICATION_JSON)), gameHandler::getRankings)
                .andRoute(GET("/api/v1/health").and(accept(MediaType.APPLICATION_JSON)), serverStateHandler::getHealth)
                ;
    }
}
