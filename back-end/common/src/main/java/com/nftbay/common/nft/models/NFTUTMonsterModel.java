package com.nftbay.common.nft.models;

import com.nftbay.common.nft.state.EnumMonsterState;
import com.nftbay.common.gamedata.model.UTMonsterModel;
import lombok.*;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Table(name = "nft_ut_monster")
@PrimaryKeyJoinColumn(name="id")
public class NFTUTMonsterModel extends NFTModel {

    @Enumerated(EnumType.STRING)
    private EnumMonsterState state;

    private long exp;

    private int type;

    private int grade;

    private int upgrade;

    private int level;

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

    public NFTUTMonsterModel() {
        super();
    }

    @Builder
    public NFTUTMonsterModel(long contractTableId, EnumMonsterState state, long exp, int type,
            int grade, int upgrade, long basicStr, long basicDex, long basicInt, long plusStr,
            long plusDex, long plusInt, int level, int monsterClass) {
        super(contractTableId, 0, 0, 0, 0, 0, upgrade, level, grade, monsterClass);
        this.state = state;
        this.exp = exp;
        this.type = type;
        this.grade = grade;
        this.upgrade = upgrade;
        this.basicStr = basicStr;
        this.basicDex = basicDex;
        this.basicInt = basicInt;
        this.plusStr = plusStr;
        this.plusDex = plusDex;
        this.plusInt = plusInt;
        this.level = level;
    }
}
