package com.nftbay.common.nft.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nftbay.common.gamedata.model.GameInfoModel;
import com.nftbay.common.trade.models.TradeModel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "nft")
@Inheritance(strategy=InheritanceType.JOINED)
public class NFTModel {

    @Id
    @GeneratedValue
    protected Long id;

    private Date created;

    private Date updated;

    private Date deleted;

    @Column(name = "item_tier")
    protected Integer itemTier;

    @Column(name = "item_upgrade")
    protected Integer itemUpgrade;

    @Column(name = "item_grade")
    protected Integer itemGrade;

    @Column(name = "servant_type")
    protected Integer servantType;

    @Column(name = "servant_level")
    protected Integer servantLevel;

    @Column(name = "monster_upgrade")
    protected Integer monsterUpgrade;

    @Column(name = "monster_level")
    protected Integer monsterLevel;

    @Column(name = "monster_grade")
    protected Integer monsterGrade;

    @Column(name = "monster_class")
    private int monsterClass;

    // nft 컨트랙 id // utstokens, utmtokens, utitokens
    @Column(name = "nft_token_id")
    protected Long nftTokenId;

    @Column(name = "game_contract_table_id")
    private long contractTableId;

    @JsonIgnore
    @OneToOne(mappedBy = "nft", cascade = CascadeType.ALL, optional = false)
    private TradeModel order;

    @Column(name = "game_info_id", insertable = false, updatable = false)
    private Long gameInfoId;

    @ManyToOne
    @JoinColumn(name = "game_info_id")
    private GameInfoModel gameInfo;

    public NFTModel() {}

    public NFTModel(long gameContractTableId, int itemTier, int itemUpgrade, int itemGrade, int servantType, int servantLevel,
            int monsterUpgrade, int monsterLevel, int monsterGrade, int monsterClass) {
        this.contractTableId = gameContractTableId;
        this.itemTier = itemTier;
        this.itemUpgrade = itemUpgrade;
        this.itemGrade = itemGrade;
        this.servantType = servantType;
        this.servantLevel = servantLevel;
        this.monsterUpgrade = monsterUpgrade;
        this.monsterLevel = monsterLevel;
        this.monsterGrade = monsterGrade;
        this.monsterClass = monsterClass;
    }
}
