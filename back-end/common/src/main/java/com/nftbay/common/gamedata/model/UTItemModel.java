package com.nftbay.common.gamedata.model;

import com.nftbay.common.nft.models.NFTUTItemModel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "ut_item")
@PrimaryKeyJoinColumn(name="id")
public class UTItemModel extends GameInfoModel {

    @Id
    private Long id;

    private int tier;

    @Column(name = "tier_icon_url")
    private String tierIconUrl;

    @Column(name = "item_type")
    private String itemType;

    @Column(name = "item_type_icon_url")
    private String itemTypeIconUrl;

    @Column(name = "equip_class")
    private String equipClass;
}
