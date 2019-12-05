package com.nftbay.common.trade.services;

import com.google.gson.JsonObject;
import com.nftbay.common.bidding.models.BiddingHistoryModel;
import com.nftbay.common.bidding.repositories.BiddingHistoryReactiveRepository;
import com.nftbay.common.nodeos.NodeosClient;
import com.nftbay.common.trade.EnumNftType;
import com.nftbay.common.trade.EnumTradeState;
import com.nftbay.common.trade.models.TradeModel;
import com.nftbay.common.trade.repositories.TradeReactiveRepository;
import com.nftbay.common.support.GrapheneUtils;
import eu.bittrade.libs.steemj.base.models.PublicKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Calendar;
import java.util.Collections;

@Service
public class TradeService {

    private GrapheneUtils grapheneUtils;
    private NodeosClient nodeosClient;
    private TradeReactiveRepository tradeReactiveRepository;
    private BiddingHistoryReactiveRepository biddingHistoryReactiveRepository;

    @Autowired
    public TradeService(GrapheneUtils grapheneUtils, NodeosClient nodeosClient,
                        TradeReactiveRepository tradeReactiveRepository, BiddingHistoryReactiveRepository biddingHistoryReactiveRepository) {
        this.grapheneUtils = grapheneUtils;
        this.nodeosClient = nodeosClient;
        this.tradeReactiveRepository = tradeReactiveRepository;
        this.biddingHistoryReactiveRepository = biddingHistoryReactiveRepository;
    }

    public Mono<Page<TradeModel>> getTodaySpecialDeal(int serviceId, Pageable pageable) {
        Calendar calendar = getInitDay();
        return tradeReactiveRepository
            .getSpecialDeal(serviceId, EnumTradeState.DONE, calendar.getTime(), pageable);
    }

    public Mono<Page<TradeModel>> getWeekSpecialDeal(int serviceId, Pageable pageable) {
        Calendar calendar = getInitDay();
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        calendar.add(Calendar.DAY_OF_MONTH, -7);
        return tradeReactiveRepository
            .getSpecialDeal(serviceId, EnumTradeState.DONE, calendar.getTime(), pageable);
    }

    public Mono<Page<TradeModel>> getMonthSpecialDeal(int serviceId, Pageable pageable) {
        Calendar calendar = getInitDay();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        return tradeReactiveRepository
            .getSpecialDeal(serviceId, EnumTradeState.DONE, calendar.getTime(), pageable);
    }

    public Calendar getInitDay() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);

        return calendar;
    }

    public Mono<Page<TradeModel>> getNewProducts(int serviceId, Pageable pageable) {
        return tradeReactiveRepository.getNewProducts(serviceId, pageable);
    }

    public Mono<Page<TradeModel>> getDeadlineProducts(int serviceId, Pageable pageable) {
        return tradeReactiveRepository.getDeadlineProducts(serviceId, pageable);
    }

    public Mono<Page<BiddingHistoryModel>> getMyBids(String accountName, String publicKey, String sig, String seed, Pageable pageable) {
        return validAccount(accountName, publicKey, sig, seed)
            .flatMap(result -> {
                if (result) {
                    return biddingHistoryReactiveRepository.getBiddingHistoryByBidder(accountName, pageable);
                }

                return Mono.just(new PageImpl<>(Collections.emptyList()));
            });
    }

    public Mono<Page<BiddingHistoryModel>> getMyHistory(EnumNftType type, String accountName, String publicKey, String sig, String seed, Pageable pageable) {
        return validAccount(accountName, publicKey, sig, seed)
                .flatMap(result -> {
                    if (result) {
                        return biddingHistoryReactiveRepository.getBiddingHistoryByBidderAndNftType(accountName, type, pageable);
                    }

                    return Mono.just(new PageImpl<>(Collections.emptyList()));
                });
    }

    public Mono<Page<TradeModel>> getMyOrders(String accountName, String publicKey, String sig, String seed, Pageable pageable) {
        return validAccount(accountName, publicKey, sig, seed)
                .flatMap(result -> {
                    if (result) {
                        return tradeReactiveRepository.getTradeByOwner(accountName, pageable);
                    }

                    return Mono.just(new PageImpl<>(Collections.emptyList()));
                });
    }

    public Mono<Boolean> validAccount(String accountName, String publicKey, String sig, String seed) {
        return nodeosClient.getAccountInfo(accountName)
            .map(accountInfo -> {
                if (accountInfo.has("account_name")) {
                    if (checkActivePublicKeyFromAccountInfo(publicKey, accountInfo)) {
                        return grapheneUtils.VerifyEosMessage(accountName + seed, sig, new PublicKey(publicKey));
                    }
                }

                return false;
            });
    }

    public boolean checkActivePublicKeyFromAccountInfo(String publicKey, JsonObject accountInfo) {
        var permissions = accountInfo.getAsJsonArray("permissions");

        for (var permission : permissions) {
            if ("active".equals(permission.getAsJsonObject().get("perm_name").getAsString())) {
                var keys = permission.getAsJsonObject().getAsJsonObject("required_auth").getAsJsonArray("keys");
                for (var key : keys) {
                    if (publicKey.equals(key.getAsJsonObject().get("key").getAsString())) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
