package com.nftbay.common.bidding.models;

import com.nftbay.common.bidding.EnumBiddingState;
import com.nftbay.common.bidding.EnumBiddingType;
import com.nftbay.common.trade.EnumNftType;
import com.nftbay.common.trade.models.TradeModel;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bidding_history")
public class BiddingHistoryModel {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "bid_eos")
    private float bidEos;

    private String bidder;

    @Enumerated(EnumType.STRING)
    @Column(name = "nft_type")
    private EnumNftType type;

    @Enumerated(EnumType.STRING)
    private EnumBiddingState state;

    @Column(name = "bidding_type")
    @Enumerated(EnumType.STRING)
    private EnumBiddingType biddingType;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "trade_id", insertable = false, updatable = false)
    private Long tradeId;

    @ManyToOne
    @JoinColumn(name = "trade_id")
    private TradeModel trade;

    private Date created;

    private Date updated;
}
