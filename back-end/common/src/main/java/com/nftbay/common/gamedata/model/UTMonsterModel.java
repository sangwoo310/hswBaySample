package com.nftbay.common.gamedata.model;

import com.nftbay.common.nft.models.NFTUTMonsterModel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "ut_monster")
@PrimaryKeyJoinColumn(name="id")
public class UTMonsterModel extends GameInfoModel {

    @Id
    private Long id;
}
