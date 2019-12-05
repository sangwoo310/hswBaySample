package com.nftbay.common.bidding.repositories;

import com.nftbay.common.bidding.models.BiddingHistoryModel;
import com.nftbay.common.support.ReactiveRepository;
import com.nftbay.common.trade.EnumNftType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public class BiddingHistoryReactiveRepository extends ReactiveRepository {

    private BiddingHistoryRepository biddingHistoryRepository;

    @Autowired
    public BiddingHistoryReactiveRepository(BiddingHistoryRepository biddingHistoryRepository) {
        this.biddingHistoryRepository = biddingHistoryRepository;
    }

    public Mono<Page<BiddingHistoryModel>> getBiddingHistoryByTradeId(Long tradeId, Pageable pageable) {
        return Mono.fromCallable(() -> biddingHistoryRepository.findByTradeId(tradeId, pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<BiddingHistoryModel>> getBiddingHistoryByBidder(String bidder, Pageable pageable) {
        return Mono.fromCallable(() -> biddingHistoryRepository.findByBidder(bidder, pageable))
            .subscribeOn(jdbcScheduler);
    }

    public Mono<Page<BiddingHistoryModel>> getBiddingHistoryByBidderAndNftType(String bidder, EnumNftType nftType, Pageable pageable) {
        return Mono.fromCallable(() -> biddingHistoryRepository.findByBidderAndType(bidder, nftType, pageable))
                .subscribeOn(jdbcScheduler);
    }
}
