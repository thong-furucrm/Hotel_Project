public with sharing class HM_RoomController {
    @AuraEnabled
    public static List<String> getPickListConvenient(){
        List<String> picklistValues = new List<String>();

        Schema.DescribeFieldResult fieldResult = Room__c.Convenient__c.getDescribe();
        List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
        
        for (Schema.PicklistEntry entry : picklistEntries) {
            picklistValues.add(entry.getValue());
        }
        System.debug(picklistValues);
        return picklistValues;
    }

    // @AuraEnabled
    // public static List<String> getAllHotel(){
    //     List<String> listHotel= [SELECT Name, Star__c, Address__c from Hotel__c];
    //     return listHotel;
    // }

    @AuraEnabled
    public static List<Hotel__c> getHotelsWithCheapestRooms() {
        // List<HotelWrapper> hotelsWithCheapestRooms = new List<HotelWrapper>();
        
        // Truy vấn tất cả hotel
        // List<Hotel__c> hotels = [SELECT Id, Name, Star__c, Address__c, 
        //                         (SELECT Id, Room_Name__c, Price__c, Discount__c, Convenient__c FROM Room__r ORDER BY Price__c ASC LIMIT 1) cheapestRoom, 
        //                         (SELECT Image_Url__c from Image_Hotel__r) hotelImages from Hotel__c WHERE ID='a0U2t000004eystEAA'];

        List<Hotel__c> hotels = [SELECT Id, Name, Star__c, Address__c, Description__c,
                                (SELECT Id, Room_Name__c, Price__c, Discount__c, Convenient__c, Room_Type__c, Room_Capacity__c, Total_Room__c FROM Room__r ORDER BY Price__c) cheapestRoom, 
                                (SELECT Image_Url__c from Image_Hotel__r) hotelImages from Hotel__c WHERE ID='a0U2t000004eystEAA'];

        System.debug(hotels);
        
        
        
        return hotels;
    }
    
    public class HotelWrapper {
        @AuraEnabled
        public Hotel__c hotel { get; set; }
        @AuraEnabled
        public Room__c cheapestRoom { get; set; }
        
        public HotelWrapper(Hotel__c hotel, Room__c cheapestRoom) {
            this.hotel = hotel;
            this.cheapestRoom = cheapestRoom;
        }
    }
}