-- -----------------------------------------------------
-- Schema nftbay
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `nftbay` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `nftbay` ;


create table block_index_state
(
    id         int          not null
        primary key,
    block_num  bigint       null,
    block_hash varchar(200) null
);

create table notice
(
    id      int auto_increment
        primary key,
    title   varchar(100) null,
    content text         null,
    type    varchar(45)  null,
    state   varchar(45)  null,
    created datetime     null,
    updated datetime     null,
    deleted datetime     null
);

create table service
(
    id       int auto_increment
        primary key,
    name     varchar(45)   null,
    `desc`   varchar(1000) null,
    contract varchar(12)   null,
    created  datetime      null,
    updated  datetime      null,
    deleted  datetime      null
);

create table game_info
(
    id               bigint        not null,
    name             varchar(100)  null,
    image_url        varchar(1000) null,
    detail_image_url varchar(1000) null,
    created          datetime      null,
    updated          datetime      null,
    deleted          datetime      null,
    service_id       int           not null,
    `desc`           varchar(1000) null,
    primary key (id, service_id),
    constraint fk_game_info_service1
        foreign key (service_id) references service (id)
);

create index fk_game_info_service1_idx
    on game_info (service_id);

create table nft
(
    id                     bigint auto_increment
        primary key,
    created                datetime null,
    updated                datetime null,
    deleted                datetime null,
    game_info_id           bigint   null,
    item_tier              int      null,
    item_upgrade           int      null,
    item_grade             int      null,
    servant_type           int      null,
    servant_level          int      null,
    monster_upgrade        int      null,
    monster_level          int      null,
    monster_grade          int      null,
    monster_class          int      null,
    nft_token_id           bigint   null,
    game_contract_table_id bigint   null,
    constraint fk_nft_game_info1
        foreign key (game_info_id) references game_info (id)
            on update cascade on delete cascade
);

create index fk_nft_game_info1_idx
    on nft (game_info_id);

create table nft_ut_item
(
    id          bigint      not null
        primary key,
    basic_str   bigint      not null,
    basic_dex   bigint      not null,
    basic_int   bigint      not null,
    plus_str    bigint      not null,
    plus_dex    bigint      not null,
    plus_int    bigint      not null,
    type        int         null,
    tier        int         null,
    job         int         null,
    grade       int         null,
    upgrade     int         null,
    atk         int         null,
    def         int         null,
    state       varchar(45) null,
    main_status int         null,
    constraint fk_ut_item_nft1
        foreign key (id) references nft (id)
);

create index fk_ut_item_nft1_idx
    on nft_ut_item (id);

create table nft_ut_monster
(
    id        bigint      not null
        primary key,
    basic_str bigint      not null,
    basic_dex bigint      not null,
    basic_int bigint      not null,
    plus_str  bigint      not null,
    plus_dex  bigint      not null,
    plus_int  bigint      not null,
    type      int         null,
    exp       bigint      null,
    grade     int         null,
    upgrade   int         null,
    state     varchar(45) null,
    level     int         null,
    constraint fk_ut_monster_nft1
        foreign key (id) references nft (id)
);

create index fk_ut_monster_nft1_idx
    on nft_ut_monster (id);

create table nft_ut_servant
(
    id            bigint      not null
        primary key,
    basic_str     bigint      not null,
    basic_dex     bigint      not null,
    basic_int     bigint      not null,
    plus_str      bigint      not null,
    plus_dex      bigint      not null,
    plus_int      bigint      not null,
    exp           bigint      null,
    stat_point    bigint      null,
    state         varchar(45) null,
    appear_head   int         null,
    appear_hair   int         null,
    appear_body   int         null,
    appear_gender int         null,
    grade         int         null,
    level         int         null,
    constraint fk_ut_servant_nft1
        foreign key (id) references nft (id)
            on delete cascade
);

create index fk_ut_servant_nft1_idx
    on nft_ut_servant (id);

create table trade
(
    id                bigint auto_increment,
    idx               bigint       null,
    t_idx             bigint       null,
    owner             varchar(45)  null,
    master            varchar(45)  null,
    seller            varchar(45)  null,
    min_price         double       null,
    max_price         double       null,
    current_price     double       null,
    state             varchar(45)  null,
    buyer             varchar(45)  null,
    bid_end_time      datetime     null,
    nft_type          varchar(45)  null,
    transaction_id    varchar(200) null,
    created           datetime     null,
    updated           datetime     null,
    deleted           datetime     null,
    service_id        int          not null,
    nft_id            bigint       not null,
    contract_trade_id bigint       null,
    primary key (id, service_id, nft_id),
    constraint fk_order_nft1
        foreign key (nft_id) references nft (id)
            on delete cascade,
    constraint fk_trade_service1
        foreign key (service_id) references service (id)
);

create table bidding_history
(
    id             bigint auto_increment,
    bid_eos        float        null,
    bidder         varchar(45)  null,
    state          varchar(45)  null,
    created        datetime     null,
    updated        datetime     null,
    transaction_id varchar(200) null,
    trade_id       bigint       not null,
    nft_type       varchar(45)  null,
    bidding_type   varchar(10)  null,
    primary key (id, trade_id),
    constraint fk_auction_trade1
        foreign key (trade_id) references trade (id)
);

create index fk_auction_trade1_idx
    on bidding_history (trade_id);

create index fk_order_nft1_idx
    on trade (nft_id);

create index fk_trade_service1_idx
    on trade (service_id);

create index idx_accoun_name
    on trade (owner);

create index idx_bid_price
    on trade (min_price);

create index idx_buy_price
    on trade (t_idx);

create table ut_item
(
    id                 bigint        not null
        primary key,
    tier               int           null,
    tier_icon_url      varchar(1000) null,
    item_type          varchar(45)   null,
    item_type_icon_url varchar(1000) null,
    equip_class        varchar(45)   null,
    constraint fk_ut_item_game_info1
        foreign key (id) references game_info (id)
            on update cascade
);

create index fk_ut_item_game_info1_idx
    on ut_item (id);

create table ut_monster
(
    id bigint not null
        primary key,
    constraint fk_ut_monster_game_info1
        foreign key (id) references game_info (id)
            on update cascade
);

create index fk_ut_monster_game_info1_idx
    on ut_monster (id);

create table ut_servant
(
    id           bigint        not null
        primary key,
    job          varchar(100)  null,
    job_icon_url varchar(1000) null,
    constraint fk_ut_servant_game_info1
        foreign key (id) references game_info (id)
            on update cascade
);

-- -----------------------------------------------------
-- Schema nftbay
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `nftbay` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `nftbay` ;


create table block_index_state
(
    id         int          not null
        primary key,
    block_num  bigint       null,
    block_hash varchar(200) null
);

create table notice
(
    id      int auto_increment
        primary key,
    title   varchar(100) null,
    content text         null,
    type    varchar(45)  null,
    state   varchar(45)  null,
    created datetime     null,
    updated datetime     null,
    deleted datetime     null
);

create table service
(
    id       int auto_increment
        primary key,
    name     varchar(45)   null,
    `desc`   varchar(1000) null,
    contract varchar(12)   null,
    created  datetime      null,
    updated  datetime      null,
    deleted  datetime      null
);

create table game_info
(
    id               bigint        not null,
    name             varchar(100)  null,
    image_url        varchar(1000) null,
    detail_image_url varchar(1000) null,
    created          datetime      null,
    updated          datetime      null,
    deleted          datetime      null,
    service_id       int           not null,
    `desc`           varchar(1000) null,
    primary key (id, service_id),
    constraint fk_game_info_service1
        foreign key (service_id) references service (id)
);

create index fk_game_info_service1_idx
    on game_info (service_id);

create table nft
(
    id                     bigint auto_increment
        primary key,
    created                datetime null,
    updated                datetime null,
    deleted                datetime null,
    game_info_id           bigint   null,
    item_tier              int      null,
    item_upgrade           int      null,
    item_grade             int      null,
    servant_type           int      null,
    servant_level          int      null,
    monster_upgrade        int      null,
    monster_level          int      null,
    monster_grade          int      null,
    monster_class          int      null,
    nft_token_id           bigint   null,
    game_contract_table_id bigint   null,
    constraint fk_nft_game_info1
        foreign key (game_info_id) references game_info (id)
            on update cascade on delete cascade
);

create index fk_nft_game_info1_idx
    on nft (game_info_id);

create table nft_ut_item
(
    id          bigint      not null
        primary key,
    basic_str   bigint      not null,
    basic_dex   bigint      not null,
    basic_int   bigint      not null,
    plus_str    bigint      not null,
    plus_dex    bigint      not null,
    plus_int    bigint      not null,
    type        int         null,
    tier        int         null,
    job         int         null,
    grade       int         null,
    upgrade     int         null,
    atk         int         null,
    def         int         null,
    state       varchar(45) null,
    main_status int         null,
    constraint fk_ut_item_nft1
        foreign key (id) references nft (id)
);

create index fk_ut_item_nft1_idx
    on nft_ut_item (id);

create table nft_ut_monster
(
    id        bigint      not null
        primary key,
    basic_str bigint      not null,
    basic_dex bigint      not null,
    basic_int bigint      not null,
    plus_str  bigint      not null,
    plus_dex  bigint      not null,
    plus_int  bigint      not null,
    type      int         null,
    exp       bigint      null,
    grade     int         null,
    upgrade   int         null,
    state     varchar(45) null,
    level     int         null,
    constraint fk_ut_monster_nft1
        foreign key (id) references nft (id)
);

create index fk_ut_monster_nft1_idx
    on nft_ut_monster (id);

create table nft_ut_servant
(
    id            bigint      not null
        primary key,
    basic_str     bigint      not null,
    basic_dex     bigint      not null,
    basic_int     bigint      not null,
    plus_str      bigint      not null,
    plus_dex      bigint      not null,
    plus_int      bigint      not null,
    exp           bigint      null,
    stat_point    bigint      null,
    state         varchar(45) null,
    appear_head   int         null,
    appear_hair   int         null,
    appear_body   int         null,
    appear_gender int         null,
    grade         int         null,
    level         int         null,
    constraint fk_ut_servant_nft1
        foreign key (id) references nft (id)
            on delete cascade
);

create index fk_ut_servant_nft1_idx
    on nft_ut_servant (id);

create table trade
(
    id                bigint auto_increment,
    idx               bigint       null,
    t_idx             bigint       null,
    owner             varchar(45)  null,
    master            varchar(45)  null,
    seller            varchar(45)  null,
    min_price         double       null,
    max_price         double       null,
    current_price     double       null,
    state             varchar(45)  null,
    buyer             varchar(45)  null,
    bid_end_time      datetime     null,
    nft_type          varchar(45)  null,
    transaction_id    varchar(200) null,
    created           datetime     null,
    updated           datetime     null,
    deleted           datetime     null,
    service_id        int          not null,
    nft_id            bigint       not null,
    contract_trade_id bigint       null,
    primary key (id, service_id, nft_id),
    constraint fk_order_nft1
        foreign key (nft_id) references nft (id)
            on delete cascade,
    constraint fk_trade_service1
        foreign key (service_id) references service (id)
);

create table bidding_history
(
    id             bigint auto_increment,
    bid_eos        float        null,
    bidder         varchar(45)  null,
    state          varchar(45)  null,
    created        datetime     null,
    updated        datetime     null,
    transaction_id varchar(200) null,
    trade_id       bigint       not null,
    nft_type       varchar(45)  null,
    bidding_type   varchar(10)  null,
    primary key (id, trade_id),
    constraint fk_auction_trade1
        foreign key (trade_id) references trade (id)
);

create index fk_auction_trade1_idx
    on bidding_history (trade_id);

create index fk_order_nft1_idx
    on trade (nft_id);

create index fk_trade_service1_idx
    on trade (service_id);

create index idx_accoun_name
    on trade (owner);

create index idx_bid_price
    on trade (min_price);

create index idx_buy_price
    on trade (t_idx);

create table ut_item
(
    id                 bigint        not null
        primary key,
    tier               int           null,
    tier_icon_url      varchar(1000) null,
    item_type          varchar(45)   null,
    item_type_icon_url varchar(1000) null,
    equip_class        varchar(45)   null,
    constraint fk_ut_item_game_info1
        foreign key (id) references game_info (id)
            on update cascade
);

create index fk_ut_item_game_info1_idx
    on ut_item (id);

create table ut_monster
(
    id bigint not null
        primary key,
    constraint fk_ut_monster_game_info1
        foreign key (id) references game_info (id)
            on update cascade
);

create index fk_ut_monster_game_info1_idx
    on ut_monster (id);

create table ut_servant
(
    id           bigint        not null
        primary key,
    job          varchar(100)  null,
    job_icon_url varchar(1000) null,
    constraint fk_ut_servant_game_info1
        foreign key (id) references game_info (id)
            on update cascade
);

