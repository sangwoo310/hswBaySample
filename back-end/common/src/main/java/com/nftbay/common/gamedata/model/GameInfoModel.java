package com.nftbay.common.gamedata.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nftbay.common.gameservice.models.GameServiceModel;
import com.nftbay.common.nft.models.NFTModel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "game_info")
@Inheritance(strategy= InheritanceType.JOINED)
public class GameInfoModel {

    @Id
    private Long id;

    private String name;

    @Column(name = "`desc`")
    private String desc;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "detail_image_url")
    private String detailImageUrl;

    private Date created;

    private Date updated;

    private Date deleted;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "service_id")
    private GameServiceModel gameService;

    @JsonIgnore
    @OneToMany(mappedBy = "gameInfo")
    private List<NFTModel> nftList;
}
