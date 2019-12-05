delete from bidding_history where id > 0;

delete from nft_ut_item where id > 0;
delete from nft_ut_servant where id > 0;
delete from nft_ut_monster where id > 0;
delete from trade where id > 0;
delete from nft where id > 0;
commit;