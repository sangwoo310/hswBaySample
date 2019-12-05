package com.nftbay.common.nft.models;

import com.nftbay.common.nft.state.EnumServantState;
import com.nftbay.common.gamedata.model.UTServantModel;
import lombok.*;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Table(name = "nft_ut_servant")
@PrimaryKeyJoinColumn(name="id")
public class NFTUTServantModel extends NFTModel {

    @Enumerated(EnumType.STRING)
    private EnumServantState state;

    private long exp;

    private int grade;

    private int level;

    @Column(name = "stat_point")
    private long statPoint;

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

    @Column(name = "appear_head")
    private int appearHead;

    @Column(name = "appear_hair")
    private int appearHair;

    @Column(name = "appear_body")
    private int appearBody;

    @Column(name = "appear_gender")
    private int appearGender;

    public NFTUTServantModel() {
        super();
    }

    @Builder
    public NFTUTServantModel(long contractTableId, EnumServantState state, long exp, long statPoint,
            long basicStr, long basicDex, long basicInt, long plusStr, long plusDex, long plusInt,
            int appearHead, int appearHair, int appearBody, int appearGender, int servantType, int level, int grade) {
        super(contractTableId, 0, 0, 0, servantType, level, 0, 0, 0, 0);
        this.state = state;
        this.exp = exp;
        this.statPoint = statPoint;
        this.basicStr = basicStr;
        this.basicDex = basicDex;
        this.basicInt = basicInt;
        this.plusStr = plusStr;
        this.plusDex = plusDex;
        this.plusInt = plusInt;
        this.appearHead = appearHead;
        this.appearHair = appearHair;
        this.appearBody = appearBody;
        this.appearGender = appearGender;
        this.grade = grade;
        this.level = level;
    }
}
