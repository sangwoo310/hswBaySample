package com.nftbay.common.nft.models;

import com.nftbay.common.nft.state.EnumItemState;
import com.nftbay.common.gamedata.model.UTItemModel;
import lombok.*;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Table(name = "nft_ut_item")
@PrimaryKeyJoinColumn(name="id")
public class NFTUTItemModel extends NFTModel {

    @Enumerated(EnumType.STRING)
    private EnumItemState state;

    private int type;

    private int tier;

    private int job;

    private int grade;

    private int upgrade;

    private int atk;

    private int def;

    @Column(name = "basic_str")
    private long basicStr;

    @Column(name = "basic_dex")
    private long basicDex;

    @Column(name = "basic_int")
    private long basicInt;

    @Column(name = "plus_str")
    private long plusStr;

    @Column(name = "plus_dex")
    private long plusDex;

    @Column(name = "plus_int")
    private long plusInt;

    @Column(name = "main_status")
    private int mainStatus;

    public NFTUTItemModel() {
        super();
    }

    @Builder
    public NFTUTItemModel(long contractTableId, EnumItemState state, int type, int tier, int job,
            int grade, int upgrade, int atk, int def, long basicStr, long basicDex, long basicInt,
            long plusStr, long plusDex, long plusInt, int mainStatus) {
        super(contractTableId, tier, upgrade, grade, 0, 0, 0, 0, 0, 0);
        this.state = state;
        this.type = type;
        this.tier = tier;
        this.job = job;
        this.grade = grade;
        this.upgrade = upgrade;
        this.atk = atk;
        this.def = def;
        this.basicStr = basicStr;
        this.basicDex = basicDex;
        this.basicInt = basicInt;
        this.plusStr = plusStr;
        this.plusDex = plusDex;
        this.plusInt = plusInt;
        this.mainStatus = mainStatus;
    }
}
