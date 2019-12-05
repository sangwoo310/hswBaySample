package com.nftbay.common.nodeos.remote;

import com.nftbay.common.nodeos.GsonEosTypeAdapterFactory;
import com.google.gson.GsonBuilder;

import java.io.Closeable;

public class Utils {


    public static void closeSilently(Closeable c) {
        if (null != c) {
            try {
                c.close();
            } catch (Throwable t) {
                // TODO Auto-generated catch block
                //e.printStackTrace();
            }
        }
    }

    public static long parseLongSafely(String content, int defaultValue) {
        if (null == content) {
            return defaultValue;
        }

        try {
            return Long.parseLong(content);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public static int parseIntSafely(String content, int defaultValue) {
        if (null == content) {
            return defaultValue;
        }

        try {
            return Integer.parseInt(content);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }


    public static String prettyPrintJson(Object object) {
        return new GsonBuilder().registerTypeAdapterFactory(new GsonEosTypeAdapterFactory())
                .excludeFieldsWithoutExposeAnnotation().setPrettyPrinting().create().toJson(object);
    }
}
