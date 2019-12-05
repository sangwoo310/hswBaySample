package com.nftbay.common.trade.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nftbay.common.bidding.models.BiddingHistoryModel;
import com.nftbay.common.gameservice.models.GameServiceModel;
import com.nftbay.common.nft.models.NFTModel;
import com.nftbay.common.trade.EnumNftType;
import com.nftbay.common.trade.EnumTradeState;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "trade")
public class TradeModel {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "contract_trade_id")
    private Long contractTradeId;

    // 토큰 인덱스 // utstokens, utmtokens, utitokens
    private Long idx;

    // 게임 컨트랙 토큰 상세 정보 인덱스
    @Column(name = "t_idx")
    private Long tokenIdx;

    // 소유자
    private String owner;

    // 게임 컨트랙 계정
    private String master;

    // 판매 등록자
    private String seller;

    @Column(name = "min_price")
    private float minPrice;

    @Column(name = "max_price")
    private float maxPrice;

    @Column(name = "current_price")
    private float currentPrice;

    @Enumerated(EnumType.STRING)
    private EnumTradeState state;

    private String buyer;

    @Column(name = "bid_end_time")
    private Date bidEndTime;

    @Column(name = "service_id", insertable = false, updatable = false)
    private int serviceId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "service_id")
    private GameServiceModel gameService;

    @OneToOne(optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "nft_id", nullable = false)
    private NFTModel nft;

    @JsonIgnore
    @OneToMany(mappedBy = "trade")
    private List<BiddingHistoryModel> auctionList = new ArrayList<>();

    @Column(name = "transaction_id")
    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "nft_type")
    private EnumNftType type;

    private Date created;

    private Date updated;

    private Date deleted;

    @Transient
    public Long getKey() {
        return id;
    }

    @Transient
    public boolean isClaim() {
        return bidEndTime.before(Calendar.getInstance().getTime());
    }
}
