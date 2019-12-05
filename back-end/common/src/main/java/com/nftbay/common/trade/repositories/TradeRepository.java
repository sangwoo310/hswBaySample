package com.nftbay.common.trade.repositories;

import com.nftbay.common.trade.EnumNftType;
import com.nftbay.common.trade.EnumTradeState;
import com.nftbay.common.trade.models.TradeModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Transactional
public interface TradeRepository extends CrudRepository<TradeModel, Long>, CustomTradeRepository {

    Page<TradeModel> findByServiceIdAndStateAndBidEndTimeGreaterThanAndDeletedIsNull(int serviceId, EnumTradeState state, Date bidEndTime, Pageable pageable);

    @Query(value = "select t from TradeModel t where t.serviceId = ?1 and t.state = ?2 and t.nft.gameInfo.name like %?3% and t.bidEndTime > ?4",
        countQuery = "select count(t) from TradeModel t where t.serviceId = ?1 and t.state = ?2 and t.nft.gameInfo.name like %?3% and t.bidEndTime > ?4")
    Page<TradeModel> findByServiceIdAndStateAndBidEndTimeGreaterThanAndDeletedIsNull(int serviceId, EnumTradeState state, String query, Date bidEndTime, Pageable pageable);

    Page<TradeModel> findByOwnerAndDeletedIsNull(String owner, Pageable pageable);

    Page<TradeModel> findByMasterAndTypeAndDeletedIsNull(String master, EnumNftType type, Pageable pageable);

    Page<TradeModel> findByServiceIdAndStateAndTypeAndBidEndTimeGreaterThanAndDeletedIsNull(int serviceId, EnumTradeState state, EnumNftType type, Date bidEndTime, Pageable pageable);

    @Query(value = "select t from TradeModel t where t.serviceId = ?1 and t.state = ?2 and t.type = ?3 and t.nft.gameInfo.name like %?4% and t.bidEndTime > ?5",
        countQuery = "select count(t) from TradeModel t where t.serviceId = ?1 and t.state = ?2 and t.type = ?3 and t.nft.gameInfo.name like %?4% and t.bidEndTime > ?5")
    Page<TradeModel> findByServiceIdAndStateAndTypeAndBidEndTimeGreaterThanAndDeletedIsNull(int serviceId, EnumTradeState state, EnumNftType type, String query, Date bidEndTime, Pageable pageable);

    Page<TradeModel> findByServiceIdAndStateAndBidEndTimeGreaterThanOrderByCreatedDesc(int serviceId, EnumTradeState state, Date bidEndTime, Pageable pageable);

    Page<TradeModel> findByServiceIdAndStateAndBidEndTimeGreaterThanOrderByBidEndTimeAsc(int serviceId, EnumTradeState state, Date bidEndTime, Pageable pageable);

    Page<TradeModel> findByServiceIdAndStateAndCreatedGreaterThanEqualOrderByCurrentPriceDesc(int serviceId, EnumTradeState state, Date created, Pageable pageable);

    TradeModel findByContractTradeId(long contractTradeId);

    TradeModel findByTransactionId(String transactionId);

    TradeModel findByTokenIdxAndSellerAndTypeAndStateAndDeletedIsNull(Long tokenIdx, String seller, EnumNftType type, EnumTradeState state);

    List<TradeModel> findByOwnerAndStateAndTypeAndBidEndTimeLessThanAndDeletedIsNull(String owner, EnumTradeState state, EnumNftType type, Date bidEndTime);
}
