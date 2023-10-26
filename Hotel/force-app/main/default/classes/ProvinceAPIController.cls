public with sharing class ProvinceAPIController {

    private static final String API_BASE_URL = 'https://provinces.open-api.vn/api/p/';

    @AuraEnabled
    public static String getProvinceData() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(API_BASE_URL);
        request.setMethod('GET');

        try {
            HttpResponse response = http.send(request);
            if (response.getStatusCode() == 200) {
                String responseBody = response.getBody();
                return responseBody;
            } else {
                System.debug('Yêu cầu HTTP không thành công với mã trạng thái: ' + response.getStatusCode());
                System.debug('Nội dung phản hồi: ' + response.getBody());
                return null;
            }
        } catch (Exception e) {
            System.debug('Ngoại lệ: ' + e.getMessage());
            return null;
        }
    }
}

// Controller: HM_Home

// LWC: hm_Home