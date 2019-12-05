package com.nftbay.api;

//import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class ParseApplication {

    public static final String S3 = "https://s3.ap-northeast-2.amazonaws.com/nftbay/images/";
    public static final String S3_SERVANT_DETAIL = "https://s3.ap-northeast-2.amazonaws.com/nftbay/images/detail_servant/ic_servant_";
    public static final String INSERT_GAME_INFO_QUERY = "insert into game_info(id, service_id, `name`, `desc`, image_url, detail_image_url, created) values (%d, 1, '%s', '%s', '%s', '%s', now());";
    public static final String INSERT_SERVANT_QUERY = "insert into ut_servant(id, job) values (%d, '%s');";
    public static final String INSERT_MONSTER_QUERY = "insert into ut_monster(id) values (%d);";
    public static final String INSERT_EQUIPMENT_QUERY = "insert into ut_item(id, tier, item_type, equip_class) values (%d, '%s', '%s', '%s');";

    public static void main(String[] args) throws IOException, InvalidFormatException {
        File excelFile1 = new File("/Users/1004589/Downloads/servant_1.xlsx");
        File excelFile2 = new File("/Users/1004589/Downloads/monster_1.xlsx");
        File excelFile3 = new File("/Users/1004589/Downloads/equipment_1.xlsx");

        Workbook workbook1 = WorkbookFactory.create(excelFile1);
        Sheet sheet1 = workbook1.getSheetAt(0);

        int id = 0;
//        String type = null;
        String name = null, desc = null, imageUrl = null, detailImageUrl = null, job = null, jobImageUrl = null;
        String tier = null, tierImageUrl = null, itemType = null, itemTypeImageUrl = null, equipClass = null;

        /// Servant
        for(int i = 3; i < 1000; i++){
            Row row = sheet1.getRow(i);
            if (row == null) break;

            for (int j = 0; j < 16; j++) {
                Cell cell = row.getCell(j);
                if (cell == null) continue;

                if (j == 0) {
                    id = (int) cell.getNumericCellValue();
                }else if(j == 7){
                    desc = cell.getStringCellValue();
                }

                else if (j == 10) {
                    job = name = cell.getStringCellValue();

                }else if(j == 14){
                    if(i >= 7){
                        imageUrl = S3 + "servant/" + (int)cell.getNumericCellValue() + ".png";
                        detailImageUrl = S3_SERVANT_DETAIL + (int)cell.getNumericCellValue() + ".png";
                    }else{
                        detailImageUrl = imageUrl = S3 + "servant/" + cell.getStringCellValue() + ".png";
                    }

                }
            }

            System.out.println(String.format(INSERT_GAME_INFO_QUERY, id, name, desc, imageUrl,detailImageUrl));
            System.out.println(String.format(INSERT_SERVANT_QUERY, id, job));
        }


        detailImageUrl = null;
        Workbook workbook2 = WorkbookFactory.create(excelFile2);
        Sheet sheet2 = workbook2.getSheetAt(0);
        ///Monster
        for(int i = 3; i < 1000; i++){
            Row row = sheet2.getRow(i);
            if (row == null) break;

            for (int j = 0; j < 17; j++) {
                Cell cell = row.getCell(j);
                if (cell == null) continue;

                if (j == 0) {
                    id = (int) cell.getNumericCellValue();
                }else if(j == 3){
                    desc = cell.getStringCellValue();

                }else if(j == 4){
                    name = cell.getStringCellValue();
                }
                else if(j == 16){
                    imageUrl = S3 + "monster/" + cell.getStringCellValue() + ".png";
                }
            }

            System.out.println(String.format(INSERT_GAME_INFO_QUERY, id, name, desc, imageUrl,detailImageUrl));
            System.out.println(String.format(INSERT_MONSTER_QUERY, id));
        }

        Workbook workbook3 = WorkbookFactory.create(excelFile3);
        Sheet sheet3 = workbook3.getSheetAt(0);
        ///Equipment
        for(int i = 2; i < 1000; i++){
            Row row = sheet3.getRow(i);
            if (row == null) break;

            for (int j = 0; j < 16; j++) {
                Cell cell = row.getCell(j);
                if (cell == null) continue;

                if (j == 0) {
                    id = (int) cell.getNumericCellValue();
                }else if(j == 1){
                    desc = cell.getStringCellValue();

                }else if(j == 2){
                    name = cell.getStringCellValue();
                }else if( j== 5){
                    itemType = cell.getStringCellValue();
                }
                else if( j== 7){
                    equipClass = Integer.toString((int)cell.getNumericCellValue());
                }
                else if(j == 8){
                    tier = Integer.toString((int)cell.getNumericCellValue());
                }
                else if(j == 15){
                    imageUrl = S3 + "equipment/" + cell.getStringCellValue() + ".png";
                }
            }

            System.out.println(String.format(INSERT_GAME_INFO_QUERY, id, name, desc, imageUrl,detailImageUrl));
            System.out.println(String.format(INSERT_EQUIPMENT_QUERY, id, tier, itemType, equipClass));
        }
    }
}
