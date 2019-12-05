#!/bin/bash

eosio-cpp -o nftbay.wasm nftbay.cpp --abigen
cleos wallet unlock -n default --password $1
cleos -u http://jungle2.cryptolions.io set contract epochchasert ./ -p epochchasert@active 
