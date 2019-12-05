package com.nftbay.common.gameservice.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nftbay.common.gamedata.model.GameInfoModel;
import com.nftbay.common.trade.models.TradeModel;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "service")
public class GameServiceModel {

    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    private String desc;

    private String contract;

    private Date created;

    private Date updated;

    private Date deleted;

    @JsonIgnore
    @OneToMany(mappedBy = "gameService")
    private List<TradeModel> orderList;

    @JsonIgnore
    @OneToMany(mappedBy = "gameService")
    private List<GameInfoModel> gameInfoList;
}
