package com.nftbay.common.trade.repositories;

import com.nftbay.common.trade.EnumNftType;
import com.nftbay.common.trade.EnumTradeState;
import com.nftbay.common.trade.models.TradeModel;
import com.nftbay.common.support.ReactiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Repository
public class TradeReactiveRepository extends ReactiveRepository {

    private TradeRepository tradeRepository;

    @Autowired
    public TradeReactiveRepository(TradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    public Mono<Page<TradeModel>> getTradeByServiceIdAndStateAndBidEndTime(int serviceId, EnumTradeState state, Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByServiceIdAndStateAndBidEndTimeGreaterThanAndDeletedIsNull(serviceId, state, Calendar.getInstance().getTime(), pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<TradeModel>> getTradeByServiceIdAndStateAndBidEndTimeWithQuery(int serviceId, EnumTradeState state, String query, Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByServiceIdAndStateAndBidEndTimeGreaterThanAndDeletedIsNull(serviceId, state, query, Calendar.getInstance().getTime(), pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<TradeModel>> getTradeByServiceIdAndStateAndNftAndBidEndTime(int serviceId, EnumTradeState state, EnumNftType nftType, Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByServiceIdAndStateAndTypeAndBidEndTimeGreaterThanAndDeletedIsNull(serviceId, state, nftType, Calendar.getInstance().getTime(), pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<TradeModel>> getTradeByServiceIdAndStateAndNftAndBidEndTimeWithQuery(int serviceId, EnumTradeState state, EnumNftType nftType, String query, Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByServiceIdAndStateAndTypeAndBidEndTimeGreaterThanAndDeletedIsNull(serviceId, state, nftType, query, Calendar.getInstance().getTime(), pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<TradeModel>> getTradeByOwner(String owner, Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByOwnerAndDeletedIsNull(owner, pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<TradeModel>> getNewProducts(int serviceId, Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByServiceIdAndStateAndBidEndTimeGreaterThanOrderByCreatedDesc(serviceId, EnumTradeState.SELLING, Calendar.getInstance().getTime(), pageable))
                .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<TradeModel>> getDeadlineProducts(int serviceId, Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByServiceIdAndStateAndBidEndTimeGreaterThanOrderByBidEndTimeAsc(serviceId, EnumTradeState.SELLING, Calendar.getInstance().getTime(), pageable))
                .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<TradeModel>> getSpecialDeal(int serviceId, EnumTradeState state, Date time, Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByServiceIdAndStateAndCreatedGreaterThanEqualOrderByCurrentPriceDesc(serviceId, state, time, pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<TradeModel>> getTradeHistoryBySellerAndNftType(String accountName, EnumNftType type,
            Pageable pageable) {
        return Mono.fromCallable(() -> tradeRepository.findByMasterAndTypeAndDeletedIsNull(accountName, type, pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<TradeModel> getSellerTradeByTokenId(String accountName, EnumNftType tokenType, long tokenId) {
        return Mono.fromCallable(() -> tradeRepository.findByTokenIdxAndSellerAndTypeAndStateAndDeletedIsNull(tokenId, accountName, tokenType, EnumTradeState.SELLING))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<List<TradeModel>> getBuyerClaimNft(String accountName, EnumNftType tokenType) {
        return Mono.fromCallable(() -> tradeRepository.findByOwnerAndStateAndTypeAndBidEndTimeLessThanAndDeletedIsNull(
                accountName, EnumTradeState.SELLING, tokenType, Calendar.getInstance().getTime()))
            .subscribeOn(jdbcScheduler);
    }
}
