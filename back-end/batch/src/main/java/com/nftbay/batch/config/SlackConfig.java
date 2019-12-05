package com.nftbay.batch.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.jakewharton.retrofit2.adapter.reactor.ReactorCallAdapterFactory;
import com.nftbay.batch.monitoring.SlackApi;
import com.nftbay.common.nodeos.GsonEosTypeAdapterFactory;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

@Configuration
public class SlackConfig {

    @Bean
    public OkHttpClient okHttpClientForSlack() {
        return new OkHttpClient.Builder().build();
    }

    @Bean
    @Autowired
    SlackApi slackApi(@Qualifier("okHttpClientForSlack") OkHttpClient okHttpClient, @Value("${slack.url}") String url) {
        Gson gson = new GsonBuilder().registerTypeAdapterFactory(new GsonEosTypeAdapterFactory())
            .serializeNulls().excludeFieldsWithoutExposeAnnotation().create();

        Retrofit retrofit = new Retrofit.Builder().baseUrl(url)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .addCallAdapterFactory(ReactorCallAdapterFactory.create()).client(okHttpClient).build();

        return retrofit.create(SlackApi.class);
    }
}
