package com.nftbay.common.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jakewharton.retrofit2.adapter.reactor.ReactorCallAdapterFactory;
import com.nftbay.common.nodeos.GsonEosTypeAdapterFactory;
import com.nftbay.common.nodeos.remote.NodeosApi;
import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import okhttp3.Protocol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
public class NodeosConfig {

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .connectTimeout(1000, TimeUnit.MILLISECONDS)
                .readTimeout(1000, TimeUnit.MILLISECONDS)
                .writeTimeout(1000, TimeUnit.MILLISECONDS)
                .protocols(Arrays.asList(Protocol.HTTP_1_1))
                .connectionPool(new ConnectionPool(5, 5, TimeUnit.MINUTES))
                .build();
    }

    @Bean("generalNodeosClient")
    NodeosApi generalNodeosClient(@Value("${nodeos.sync_host_list}") String[] hosts) {
        Gson gson = new GsonBuilder().registerTypeAdapterFactory(new GsonEosTypeAdapterFactory())
                .serializeNulls().excludeFieldsWithoutExposeAnnotation().create();

        Retrofit retrofit = new Retrofit.Builder().baseUrl(hosts[0])
                .addConverterFactory(GsonConverterFactory.create(gson))
                .addCallAdapterFactory(ReactorCallAdapterFactory.create())
                .client(new OkHttpClient.Builder()
                        .connectTimeout(200, TimeUnit.MILLISECONDS)
                        .readTimeout(200, TimeUnit.MILLISECONDS)
                        .writeTimeout(200, TimeUnit.MILLISECONDS)
                        .protocols(Arrays.asList(Protocol.HTTP_1_1))
                        .connectionPool(new ConnectionPool(10, 5, TimeUnit.MINUTES))
                        .build())
                .build();

        return retrofit.create(NodeosApi.class);
    }

    @Bean("nodeosApis")
    @Autowired
    List<NodeosApi> nodeosApiList(OkHttpClient okHttpClient, @Value("${nodeos.sync_host_list}") String[] hosts) {
        List<NodeosApi> nodeosApis = new ArrayList<>();

        for (String host : hosts) {
            Gson gson = new GsonBuilder().registerTypeAdapterFactory(new GsonEosTypeAdapterFactory())
                    .serializeNulls().excludeFieldsWithoutExposeAnnotation().create();

            Retrofit retrofit = new Retrofit.Builder().baseUrl(host)
                    .addConverterFactory(GsonConverterFactory.create(gson))
                    .addCallAdapterFactory(ReactorCallAdapterFactory.create()).client(okHttpClient)
                    .build();

            nodeosApis.add(retrofit.create(NodeosApi.class));
        }

        return nodeosApis;
    }
}
