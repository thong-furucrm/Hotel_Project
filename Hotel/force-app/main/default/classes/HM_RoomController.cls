public with sharing class HM_RoomController {
    // @AuraEnabled
    // public static List<String> getPickListConvenient(){
    //     List<String> picklistValues = new List<String>();
    //     Schema.DescribeFieldResult fieldResult = Room__c.Convenient__c.getDescribe();
    //     List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();
    //     for (Schema.PicklistEntry entry : picklistEntries) {
    //         picklistValues.add(entry.getValue());
    //     }
    //     System.debug(picklistValues);
    //     return picklistValues;
    // }

    @AuraEnabled
    public static List<ConvenientWrapper> getListConvenient(){
        List<ConvenientWrapper> pickListValuesList = new List<ConvenientWrapper>();
         Schema.DescribeFieldResult fieldResult = Room__c.Convenient__c.getDescribe();
         List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
         for( Schema.PicklistEntry pickListVal : ple){
            ConvenientWrapper convenient = new ConvenientWrapper();
            convenient.label = pickListVal.getLabel();
            convenient.value = pickListVal.getValue();
            pickListValuesList.add(convenient);
         }     
         return pickListValuesList;
     }

    @AuraEnabled
    public static Hotel__c getHotelsWithCheapestRooms(String idHotel) {
        Hotel__c hotels = [SELECT Id, Name, Star__c, Address__c, Description__c,
                                (SELECT Id, Room_Name__c, Price__c, Discount__c, Convenient__c, Room_Type__c, Room_Capacity__c, Total_Room__c FROM Room__r ORDER BY Price__c) cheapestRoom, 
                                (SELECT Id, Image_Url__c from Image_Hotel__r) hotelImages from Hotel__c WHERE ID= :idHotel];
        System.debug(hotels);
        return hotels;
    }
    

    @AuraEnabled
    public static Room__c getRoomDetails(String idRoom){
        try {
            Room__c roomDetail = [SELECT Id, Room_Name__c, Area__c, Convenient__c, Room_Type__c, (SELECT Image_Url__c from Image_Room__r) FROM Room__c where Id = :idRoom];
            return roomDetail;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Hotel__c> getRoomBooking(String idRoom){
        try {
            List<Hotel__c> roomBooking = [SELECT Name, Address__c, (SELECT Id, Room_Name__c, Room_Type__c, Price__c, Discount__c FROM Room__r where Id = :idRoom) from Hotel__c];
            return roomBooking;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }







    public static Set<String> checkStartDate(String startDate, Integer totalBookingRoom, Integer capacity){
        System.debug('check start date: ' + startDate + totalBookingRoom + capacity);
        String query = '';
        query = 'Select Room_Id__c, Name, Total_Room__c from Booking__c Where End_Time__c >= {0} AND Start_Time__c <= {1}';
        query = String.format(query, new List<String> {startDate, startDate});
        List<Booking__c> bookings = new List<Booking__c>();
        try {
            bookings = Database.query(query);
            Map<String, Integer> mapRoomTotalBooking = new Map<String, Integer>();
        for (Booking__c b: bookings) {
            Integer roomBooking = 0;
            if(mapRoomTotalBooking.get(b.Room_Id__c) != null){
                roomBooking = mapRoomTotalBooking.get(b.Room_Id__c);
            }
            roomBooking += b.Total_Room__c.intValue();
            mapRoomTotalBooking.put(b.Room_Id__c, roomBooking);
        }

        Set<String> hotelId = new Set<String>();

        List<Room__c> rooms = new List<Room__c>();
        if(capacity == null){
            rooms = [Select Id, Name, Hotel_Id__c, Total_Room__c From Room__c];
        }else{
            rooms = [Select Id, Name, Hotel_Id__c, Total_Room__c from Room__c where Room_Capacity__c = :capacity];
        }
        System.debug('roooms: '+ rooms);
        for (Room__c r: rooms) {
            if(mapRoomTotalBooking.get(r.Id) == null){
                System.debug('call iff 1');
                hotelId.add(r.Hotel_Id__c);
            }else{
                System.debug('call else 1');
                Integer totalBooking = mapRoomTotalBooking.get(r.Id);
                System.debug('totalBooking: '+ totalBooking);
                System.debug('check start date: ' + r.Total_Room__c + totalBooking + totalBookingRoom);
                Decimal abc = (r.Total_Room__c - totalBooking);
                System.debug('sum: ' + abc);
                if(r.Total_Room__c - totalBooking >= totalBookingRoom){
                    hotelId.add(r.Hotel_Id__c);
                }
            }
        }
        System.debug('hotelId: ' + hotelId);
        return hotelId;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String, Object> getAllHotel(String province, String startDate, Integer capacity, List<String> convenients, Integer totalRoomBooking, 
                                            Integer pageNumber, Integer pageSize){
        System.debug('call get all hotel: ' + province + startDate + capacity + convenients + totalRoomBooking + pageNumber + pageSize);

        Integer offset = (pageNumber - 1) * pageSize;   
        String totalRecordQuery = '';
        String queryInclude = '';  
        String filterHotelByRoom = '';

        String query = 'SELECT Id, Name, Star__c, Address__c, Description__c, ' + 
                        '(SELECT Id, Room_Name__c, Price__c, Discount__c, Convenient__c, Room_Type__c, Room_Capacity__c,' +
                        ' Total_Room__c FROM Room__r {2} {5}) cheapestRoom, ' +
                        '(SELECT Image_Url__c from Image_Hotel__r) hotelImages ' +  
                        'FROM Hotel__c {3} {4} LIMIT {0} OFFSET {1}';

        // Filter by convenient
        if(convenients.size() != 0){
            for (String convenient : convenients) {
                queryInclude += ' Convenient__c INCLUDES (\'' + convenient + '\') AND';
            }
            queryInclude = queryInclude.substring(0, queryInclude.length() - 3);
        }
        System.debug('queryInclude: ' + queryInclude);

        // Check total room filter
        Integer filterByTotalRoom = 1;
        if(totalRoomBooking != null){
            filterByTotalRoom = totalRoomBooking;
        }

        // Check capacity filter
        List<Room__c> rooms = [Select Id, Hotel_Id__c, Room_Capacity__c from Room__c];
        if(capacity != null){
            rooms = [Select Id, Hotel_Id__c, Room_Capacity__c from Room__c where Room_Capacity__c = :capacity];
        }

        // Check filter
        if(province == null && convenients.size() == 0){
            System.debug('call 0');
            // query is not filter
            query = String.format(query, new List<String> {''+pageSize, ''+offset, '', '', '', ''});
            totalRecordQuery = 'SELECT count() FROM Hotel__c';
            // (province != null && startDate != null && capacity != null && convenients.size() != 0 && totalRoomBooking != null)
        }else if(province != null  && convenients.size() != 0){
            System.debug('call 1');
            // query is all filter
            Set<String> hotelId = new Set<String>();
            if(startDate != null){
                hotelId = checkStartDate(startDate, filterByTotalRoom, capacity);
            }else{
                hotelId = checkStartDate('2022-10-10', filterByTotalRoom, capacity);
            }
            System.debug('hotelId: ' + hotelId);
            // Set<String> hotelIdFilterByCapacity = new Set<String>();
            // List<String> roomId = new List<String>();
            // for (Room__c r: rooms) {
            //     if(r.Hotel_Id__c != null){
            //         hotelIdFilterByCapacity.add(r.Hotel_Id__c);
            //         roomId.add(r.Id);
            //     }
            // }
            // String roomIdFormat = '(\'' + String.join(new List<String>(roomId), '\', \'') + '\')';
            // System.debug('roomIdFormat: ' + roomIdFormat);
            // System.debug('hotelIdFilterByCapacity: ' + hotelIdFilterByCapacity);
            // hotelId.retainAll(hotelIdFilterByCapacity);
            String hotelIdFormat = '(\'' + String.join(new List<String>(hotelId), '\', \'') + '\')';
            System.debug('hotelIdFormat: ' + hotelIdFormat);
            
            // Build options
            filterHotelByRoom = 'WHERE Id IN (SELECT Hotel_Id__c FROM Room__c WHERE ' + queryInclude + ') AND Address__c LIKE \'%' + province + '%\' AND Id IN ' + hotelIdFormat;
            System.debug('filterHotelByRoom: '+ filterHotelByRoom);
            query = String.format(query, new List<String> {''+pageSize, ''+offset , 'WHERE '+ queryInclude, filterHotelByRoom, '', ''});

            totalRecordQuery = 'SELECT COUNT() FROM Hotel__c WHERE Id IN (SELECT Hotel_Id__c FROM Room__c WHERE ' + queryInclude + 
                                ') AND Address__c LIKE \'%' + province + '%\' AND Id IN ' + hotelIdFormat;
                                
        // (province != null )
        }else{
            System.debug('call 2');
            // query is only province filter
            Set<String> hotelId = checkStartDate(startDate, filterByTotalRoom, capacity);
            System.debug('hotelId: ' + hotelId);
            // Set<String> hotelIdFilterByCapacity = new Set<String>();
            // List<String> roomId = new List<String>();
            // for (Room__c r: rooms) {
            //     if(r.Hotel_Id__c != null){
            //         hotelIdFilterByCapacity.add(r.Hotel_Id__c);
            //         roomId.add(r.Id);
            //     }
            // }
            // String roomIdFormat = '(\'' + String.join(new List<String>(roomId), '\', \'') + '\')';
            // System.debug('roomIdFormat: ' + roomIdFormat);
            // System.debug('hotelIdFilterByCapacity: ' + hotelIdFilterByCapacity);
            // hotelId.retainAll(hotelIdFilterByCapacity);
            String hotelIdFormat = '(\'' + String.join(new List<String>(hotelId), '\', \'') + '\')';
            System.debug('hotelIdFormat: ' + hotelIdFormat);
            
            // Build options
            filterHotelByRoom = 'WHERE Id IN (SELECT Hotel_Id__c FROM Room__c ) AND Address__c LIKE \'%' + province + '%\' AND Id IN ' + hotelIdFormat;
            System.debug('filterHotelByRoom: '+ filterHotelByRoom);
            query = String.format(query, new List<String> {''+pageSize, ''+offset , '', filterHotelByRoom, '', ''});
            totalRecordQuery = 'SELECT COUNT() FROM Hotel__c WHERE Id IN (SELECT Hotel_Id__c FROM Room__c ) AND Address__c LIKE \'%' + 
                                province + '%\' AND Id IN ' + hotelIdFormat;
        }

        // Debug query
        System.debug('11: ' + query);

        Map<String, Object> result = new Map<String, Object>();

        try {
            List<Hotel__c> hotels = new List<Hotel__c>();
            hotels = Database.query(query);
            System.debug('final query hotel: ' + hotels);
            Integer totalRecords = Database.countQuery(totalRecordQuery);
            Integer totalPages = (totalRecords + pageSize - 1) / pageSize;
            result.put('hotels', hotels);
            result.put('totalPages', totalPages);
            System.debug(result);
            return result;
        } catch (Exception e) {
            System.debug('error: '+ e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }












    @AuraEnabled
    public static Map<String, Object> getPaginatedHotels(Integer pageNumber, Integer pageSize, List<String> convenients, String province, String orderByHotel, String orderByRoom, String starDate) { 
        // if(starDate !== null){

            // getAllHotel('Ho Chi Minh', '2023-11-13', 2, convenients, '', 1, 1);

            List<Booking__c> bookings = [Select Room_Id__c, Name, Total_Room__c from Booking__c Where End_Time__c >=2023-11-13 AND Start_Time__c <= 2023-11-13];
            Map<String, Integer> mapRoomTotalBooking = new Map<String, Integer>();
            for (Booking__c b: bookings) {
                Integer roomBooking = 0;
                if(mapRoomTotalBooking.get(b.Room_Id__c) != null){
                    roomBooking = mapRoomTotalBooking.get(b.Room_Id__c);
                }
                roomBooking += b.Total_Room__c.intValue();
                mapRoomTotalBooking.put(b.Room_Id__c, roomBooking);
            }

            Set<String> roomId = new Set<String>();

            List<Room__c> rooms = [Select Id, Name, Hotel_Id__c, Total_Room__c From Room__c];
            for (Room__c r: rooms) {
                if(mapRoomTotalBooking.get(r.Id) == null){
                    roomId.add(r.Hotel_Id__c);
                }else{
                    Integer totalBooking = mapRoomTotalBooking.get(r.Id);
                    if(r.Total_Room__c - totalBooking > 0){
                        roomId.add(r.Hotel_Id__c);
                    }
                }
            }
            System.debug('roomId: ' + roomId);
            List<Hotel__c> hotels1 = [Select id, Name from Hotel__c where Id IN :roomId];
            System.debug('hotels1: ' + hotels1);

        // }
        Integer offset = (pageNumber - 1) * pageSize;
        Map<String, Object> result = new Map<String, Object>();
        String query = 'SELECT Id, Name, Star__c, Address__c, Description__c, ' + 
                        '(SELECT Id, Room_Name__c, Price__c, Discount__c, Convenient__c, Room_Type__c, Room_Capacity__c,' +
                        ' Total_Room__c FROM Room__r {2} {5}) cheapestRoom, ' +
                        '(SELECT Image_Url__c from Image_Hotel__r) hotelImages ' +  
                        'FROM Hotel__c {3} {4} LIMIT {0} OFFSET {1}';
        String queryInclude = '';
        if(convenients.size() != 0){
            for (String convenient : convenients) {
                queryInclude += ' Convenient__c INCLUDES (\'' + convenient + '\') AND';
            }
            queryInclude = queryInclude.substring(0, queryInclude.length() - 3);
        }
        System.debug('queryInclude: ' + queryInclude);
        System.debug('province: '+province);
        String filterByProvince;
        String filterHotelByRoom = '';
        String totalRecordQuery = '';

        if(convenients.size() == 0 && province == null){
            query = String.format(query, new List<String> {''+pageSize, ''+offset, queryInclude, filterHotelByRoom, orderByHotel, orderByRoom});
            totalRecordQuery = 'SELECT count() FROM Hotel__c';
        }else if(convenients.size() != 0 && province != null){
            filterHotelByRoom = 'WHERE Id IN (SELECT Hotel_Id__c FROM Room__c WHERE ' + queryInclude + ') AND Address__c LIKE \'%' + province + '%\'';
            query = String.format(query, new List<String> {''+pageSize, ''+offset , 'WHERE '+queryInclude, filterHotelByRoom, orderByHotel, orderByRoom});
            totalRecordQuery = 'SELECT COUNT() FROM Hotel__c WHERE Id IN (SELECT Hotel_Id__c FROM Room__c WHERE ' + queryInclude + ') AND Address__c LIKE \'%' + province + '%\'';
        }
        else if(convenients.size() != 0){
            filterHotelByRoom = 'WHERE Id IN (SELECT Hotel_Id__c FROM Room__c WHERE ' + queryInclude + ')';
            query = String.format(query, new List<String> {''+pageSize, ''+offset , 'WHERE '+queryInclude, filterHotelByRoom, orderByHotel, orderByRoom});
            totalRecordQuery = 'SELECT COUNT() FROM Hotel__c WHERE Id IN (SELECT Hotel_Id__c FROM Room__c WHERE ' + queryInclude + ')';
            System.debug('filterHotelByRoom: '+ filterHotelByRoom);
            System.debug('query3: ' + query);
            System.debug('query4: ' + totalRecordQuery);
        }else{
            filterByProvince = 'WHERE Address__c LIKE \'%'+ province + '%\'';
            query = String.format(query, new List<String> {''+pageSize, ''+offset, '', filterByProvince, orderByHotel, orderByRoom});
            totalRecordQuery = 'SELECT count() FROM Hotel__c WHERE Address__c LIKE \'%' + province + '%\'';
        }
        try {
            System.debug('getPaginatedHotels query1: ' + query);
            System.debug('getPaginatedHotels query2: ' + totalRecordQuery);
            List<Hotel__c> hotels = new List<Hotel__c>();
            hotels = Database.query(query);
            Integer totalRecords = Database.countQuery(totalRecordQuery);
            Integer totalPages = (totalRecords + pageSize - 1) / pageSize;
            result.put('hotels', hotels);
            result.put('totalPages', totalPages);
            return result;
        } catch (QueryException e) {
            System.debug('Lỗi truy vấn SOQL: ' + e.getMessage());
            return null;
        }
    }

    @AuraEnabled
    public static List<Booking__c> getBookingByDate(Date startDate){
        try {
            List<Booking__c> bookings = [SELECT Id, Start_Time__c, End_Time__c, Room_Id__c FROM Booking__c WHERE Start_Time__c <=: startDate AND End_Time__c >= : startDate];
            System.debug('booking: ' + bookings);
            return bookings;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Hotel__c> filterHotelByDate(String province, String startDate, String roomCapacity){
        System.debug('filterHotelByDate');
        String query = 'SELECT Id, Name, Star__c, Address__c, Description__c, (SELECT Image_Url__c from Image_Hotel__r), (SELECT Id, Name, Hotel_Id__c, Room_Name__c, Price__c, Discount__c, Convenient__c, Room_Type__c, Room_Capacity__c, Total_Room__c FROM Room__r WHERE {2} Id NOT IN (SELECT Room_Id__c FROM Booking__c {0})) FROM Hotel__c WHERE Id IN (SELECT Hotel_Id__c FROM Room__c) {1}';
        if(startDate != null && province != null && roomCapacity !=null){
            System.debug(4);
            query = String.format(query, new List<String> {'WHERE (End_Time__c >=' + startDate + ' AND Start_Time__c <= ' +  startDate + ')', 'AND Address__c LIKE \'%' + province + '%\'', 'Room_Capacity__c ='+ roomCapacity +' AND'});
        }else if(startDate != null && roomCapacity != null){
            System.debug(3);
            query = String.format(query, new List<String> {'WHERE (End_Time__c >=' + startDate + ' AND Start_Time__c <= ' +  startDate + ')', '', 'Room_Capacity__c ='+ roomCapacity +' AND'});
        }else if(province != null && roomCapacity != null){
            System.debug(2);
            query = String.format(query, new List<String> {'', 'AND Address__c LIKE \'%' + province + '%\'', 'Room_Capacity__c ='+ roomCapacity +' AND'});
        }else if(province != null && startDate != null){
            System.debug(1);
            query = String.format(query, new List<String> {'WHERE (End_Time__c >=' + startDate + ' AND Start_Time__c <= ' +  startDate + ')', 'AND Address__c LIKE \'%' + province + '%\'', ''});
        }else if(province != null){
            System.debug(0);
            query = String.format(query, new List<String> {'', 'AND Address__c LIKE \'%' + province + '%\'', ''});
        }else if(startDate != null){
            System.debug(-1);
            query = String.format(query, new List<String> {'WHERE (End_Time__c >=' + startDate + ' AND Start_Time__c <= ' +  startDate + ')', '', ''});
        }else if(roomCapacity != null){
            System.debug(-2);
            query = String.format(query, new List<String> {'', '', 'Room_Capacity__c ='+ roomCapacity});
        }else{
            System.debug(-3);
            query = String.format(query, new List<String> {'', '', ''});
        }
        try {
            System.debug('query: '+ query);
            List<Hotel__c> hotels = new List<Hotel__c>();
            hotels = Database.query(query);
            System.debug('find hotel by date and province: ' + hotels);
            return hotels;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean createBooking(String firstName, String lastName, String email, String phone, Date startDate, Date endDate, String roomId, Decimal totalRoom) {
        try {
            List<Contact> existingContact = [SELECT Id FROM Contact WHERE Email = :email LIMIT 1];
            if (existingContact.isEmpty()) {
                Contact newContact = new Contact(
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    Phone = phone
                );
                insert newContact;
                createNewBooking(newContact.Id, roomId, startDate, endDate, totalRoom);
            } else {
                createNewBooking(existingContact[0].Id, roomId, startDate, endDate, totalRoom);
            }
        return true;
        }catch (QueryException e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static void createNewBooking(Id contactId, String roomId, Date startDate, Date endDate, Decimal totalRoom) {
        System.debug('call create booking');
        Booking__c newBooking = new Booking__c(
            Contact__c = contactId,
            Room_Id__c = roomId,
            Start_Time__c = startDate,
            End_Time__c = endDate,
            Total_Room__c = totalRoom
            );
        System.debug('newBooking: ' + newBooking);
        insert newBooking;
    }

    @AuraEnabled
    public static List<Room__c> findRoomByDate(String hotelId, String startDate, String capacity){
        System.debug(hotelId + startDate + capacity);
        String query = 'SELECT Id, Room_Name__c, Price__c, Discount__c, Room_Type__c, Room_Capacity__c, Total_Room__c FROM Room__c WHERE Hotel_Id__c = {0} AND Id NOT IN (SELECT Room_Id__c FROM Booking__c WHERE (Start_Time__c <= {1} AND End_Time__c >= {2})) {3}';
        if(capacity == null){
            query = String.format(query, new List<String> {'\'' + hotelId + '\'', startDate, startDate, ''});
        }else{
            query = String.format(query, new List<String> {'\'' + hotelId + '\'', startDate, startDate, 'AND Room_Capacity__c = ' + capacity});
        }
        System.debug('query: ' + query);
        try {
            List<Room__c> rooms = new List<Room__c>();
            rooms = Database.query(query);
            System.debug('find rooms by date: ' + rooms);
            return rooms;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

     public class ConvenientWrapper {
        @AuraEnabled
        public String label {get; set;}
        @AuraEnabled
        public String value {get; set;}
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

    // @AuraEnabled
    // public static List<Hotel__c> filterHotel(String province){
    //     String query = 'SELECT Id, Name, Star__c, Address__c, '+
    //     '(SELECT Id, Name, Convenient__c, Room_Type__c, Price__c, Room_Capacity__c FROM Room__r) FROM Hotel__c {0}';
        
    //     if(province !== null){
    //         query = filterByProvince(query);
    //     }
    //     try {

    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    // public static String filterByProvince(String query){
    //     return query = String.format(query, new List<String> {'WHERE Address__c LIKE \'%' + province + '%\''});
    // }
}