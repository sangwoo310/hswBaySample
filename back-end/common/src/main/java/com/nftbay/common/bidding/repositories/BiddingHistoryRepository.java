package com.nftbay.common.bidding.repositories;

import com.nftbay.common.bidding.models.BiddingHistoryModel;
import com.nftbay.common.trade.EnumNftType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface BiddingHistoryRepository extends CrudRepository<BiddingHistoryModel, Long> {

    Page<BiddingHistoryModel> findByTradeId(Long tradeId, Pageable pageable);

    Page<BiddingHistoryModel> findByBidder(String bidder, Pageable pageable);

    Page<BiddingHistoryModel> findByBidderAndType(String bidder, EnumNftType type, Pageable pageable);

    List<BiddingHistoryModel> findByBidderAndTradeIdOrderByCreatedDesc(String bidder, Long tradeId);

    BiddingHistoryModel findByTransactionId(String transactionId);

    List<BiddingHistoryModel> findByTradeId(Long tradeId);
}
