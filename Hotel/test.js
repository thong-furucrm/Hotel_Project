// URL của API tỉnh thành Việt Nam


// Sử dụng fetch để gọi API
// fetch('https://provinces.open-api.vn/api/p/')
//   .then(response => response.json())
//   .then(data => {
//     // Lặp qua dữ liệu và in ra tên tỉnh, thành phố
//     data.forEach(province => {
//       console.log(province.name);
//     });
//     console.log(data.length);
//   })
//   .catch(error => {
//     console.error('Lỗi khi gọi API:', error);
//   });

// defaultStartDate = () => {
//   const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
//   const formattedDate = new Date().toLocaleDateString('en-GB', options);
// console.log(formattedDate); // Kết quả: "27-10-2023"
// }

// defaultStartDate()

// const inputDate = "2023-10-27";
// const dateObj = new Date(inputDate);
// const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
// const formattedDate = dateObj.toLocaleDateString('en-GB', options);
// console.log(formattedDate); // Kết quả: "27-10-2023"

// defaultEndDate = () => {
//   const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
//   const formattedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', options);
//   return formattedDate
// }

// defaultEndDate()

const result = [
  {
    "Id": "a0U2t000004eystEAA",
    "Name": "City Plaza Hotel",
    "Star__c": 4,
    "Address__c": "23 Nguyen Du - Quan Hai Ba Trung - Ha Noi",
    "Description__c": "Tọa lạc tại thành phố Hà Nội, cách Quảng trường Lâm Viên 1,7 km và Hồ Xuân Hương 1,9 km, Thanh Thanh 3 cung cấp chỗ nghỉ với nhà hàng và WiFi miễn phí trong toàn bộ khuôn viên cũng như chỗ đỗ xe riêng miễn phí cho khách lái xe. Khách sạn 3 sao này cung cấp dịch vụ phòng và quầy lễ tân 24 giờ. Chỗ nghỉ không gây dị ứng và nằm cách Công viên Yersin Đà Lạt 2 km.\r\n\r\nTại khách sạn, tất cả phòng nghỉ đều được trang bị tủ để quần áo, TV màn hình phẳng, phòng tắm riêng, bộ khăn trải giường và khăn tắm. Các phòng có ấm đun nước trong khi một số phòng còn có ban công và những phòng khác nhìn ra quang cảnh thành phố. Tất cả các phòng nghỉ sẽ cung cấp cho khách tủ lạnh.\r\n\r\nKhách tại Thanh Thanh 3 có thể thưởng thức bữa sáng à la carte.\r\n\r\nĐi bộ đường dài và đi xe đạp là hoạt động phổ biến trong khu vực này. Ngoài ra, khách sạn còn có dịch vụ cho thuê xe đạp và xe hơi.\r\n\r\nCâu lạc bộ Golf Đà Lạt Palace cách chỗ nghỉ 2,6 km trong khi Vườn hoa Đà Lạt cách đó 2,9 km. Sân bay gần nhất là Sân bay Liên Khương, cách Thanh Thanh 3 28 km.",
    "Image_Hotel__r": [
      {
        "Hotel_Id__c": "a0U2t000004eystEAA",
        "Id": "a0V2t000007QYXVEA4",
        "Image_Url__c": "https://cf.bstatic.com/xdata/images/hotel/square200/463436589.webp?k=6ec406f898767976fddc88f5023af7c7a11b2eb501564b3a81dbea611ac0d3cb&o="
      },
      {
        "Hotel_Id__c": "a0U2t000004eystEAA",
        "Id": "a0V2t000007QZX0EAO",
        "Image_Url__c": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/501483847.jpg?k=adf11245e9a532ae420b1138fb8a98514679ae96e767e0d5b2c77cc4bcc6f510&o=&hp=1"
      },
      {
        "Hotel_Id__c": "a0U2t000004eystEAA",
        "Id": "a0V2t000007QZWqEAO",
        "Image_Url__c": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/501483844.jpg?k=e03e9726eaff341613e0a76039ce81189a22684e3f5a8bc81f2120bf0db7ebaa&o=&hp=1"
      },
      {
        "Hotel_Id__c": "a0U2t000004eystEAA",
        "Id": "a0V2t000007QZX5EAO",
        "Image_Url__c": "https://cf.bstatic.com/xdata/images/hotel/max1024x768/501482459.jpg?k=f08a6797388e963a994662b5e37749ae0c5c589ab9d8ce5ae37282326d1b47c5&o=&hp=1"
      }
    ],
    "Room__r": [
      {
        "Hotel_Id__c": "a0U2t000004eystEAA",
        "Id": "a0W2t000008qzb6EAA",
        "Room_Name__c": "Superior Riverside View Room",
        "Price__c": 500000,
        "Discount__c": 5,
        "Convenient__c": "Room service;24-hour front desk;Lift;Breakfast;Airport shuttle;Non-smoking rooms",
        "Room_Type__c": "Standard Room"
      },
      {
        "Hotel_Id__c": "a0U2t000004eystEAA",
        "Id": "a0W2t000008qzahEAA",
        "Room_Name__c": "Deluxe Garden View Room",
        "Price__c": 1200000,
        "Discount__c": 10,
        "Convenient__c": "Free Wifi;Free parking;Room service;24-hour front desk",
        "Room_Type__c": "Ocean View Room"
      },
      {
        "Hotel_Id__c": "a0U2t000004eystEAA",
        "Id": "a0W2t000008qzb1EAA",
        "Room_Name__c": "Deluxe Room",
        "Price__c": 1300000,
        "Discount__c": 5,
        "Convenient__c": "Breakfast;Airport shuttle;Non-smoking rooms;Restaurant",
        "Room_Type__c": "Deluxe Room"
      }
    ]
  }
]

// const modifiedResult = result.map(item => {
//   item.Star__c = Array.from({ length: item.Star__c }, (_, i) => i + 1);
//   item.Image_Hotel__r = item.Image_Hotel__r[0].Image_Url__c;
//   item.Room__r = item.Room__r[0]
//   return item;
// });

// console.log(modifiedResult);

// Chuỗi ban đầu
// const Convenient__c = "Room service;24-hour front desk;Lift;Breakfast;Airport shuttle;Non-smoking rooms";

// // Cắt chuỗi thành mảng bằng dấu chấm phẩy
// const convenienceArray = Convenient__c.split(";");

// // Random thứ tự của mảng
// for (let i = convenienceArray.length - 1; i > 0; i--) {
//   const j = Math.floor(Math.random() * (i + 1));
//   [convenienceArray[i], convenienceArray[j]] = [convenienceArray[j], convenienceArray[i]];
// }

// // Lấy chỉ 2 phần tử từ mảng
// const selectedConveniences = convenienceArray.slice(0, 2);

// // In ra 2 phần tử đã chọn
// console.log(selectedConveniences);

// const modifiedResult = result.map(item => {
//   item.Star__c = Array.from({ length: item.Star__c }, (_, i) => i + 1);
//   item.Image_Hotel__r = item.Image_Hotel__r.map(record => record.Image_Url__c);
//   item.Convenient__c = item.Room__r[0].Convenient__c.split(';');
//   // Chuyển Room__r thành mảng chứa các đối tượng
//   item.Room__r = item.Room__r.map(room => ({
//     Room_Id__c: room.Id,
//     Room_Name__c: room.Room_Name__c,
//     Price__c: room.Price__c,
//     Discount__c: room.Discount__c,
//     // Convenient__c: room.Convenient__c.split(';'),
//     Room_Type__c: room.Room_Type__c
//   }));


//   return item;
// });

// In ra kết quả
// console.log(JSON.stringify(modifiedResult.Room__r, null, 2));



// // console.log(modifiedResult);
// console.log(modifiedResult[0].Room__r);

// function tinhSoDem(startDate, endDate) {
//   // Chuyển chuỗi ngày thành đối tượng Date
//   const startDateObj = new Date(startDate);
//   const endDateObj = new Date(endDate);

//   // Tính hiệu giữa hai ngày (đơn vị là mili giây)
//   const timeDifference = endDateObj - startDateObj;

//   // Chuyển mili giây thành số ngày (1 ngày = 86400 giây)
//   const numberOfNights = timeDifference / (1000 * 60 * 60 * 24);

//   return numberOfNights;
// }

// const startDate = "2023-11-17";
// const endDate = "2023-11-20";

// const numberOfNights = tinhSoDem(startDate, endDate);
// console.log("Số đêm: " + numberOfNights);

// const listPage = []
// for (let i = 1; i <= 5; i++) {
//   listPage.push({ page: i, isActive: 'active' })
// }
// console.log(listPage);

// function removeDiacritics(inputString) {
//   return inputString.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/(Tỉnh|Thành phố) /g, '')
// }

// var inputString1 = "Tỉnh Hà Nội";
// var inputString2 = "Thành phố Hồ Chí Minh";
// var inputString3 = "Cái Răng";

// var output1 = removeDiacritics(inputString1);
// var output2 = removeDiacritics(inputString2);
// var output3 = removeDiacritics(inputString3);

// console.log(output1); // Kết quả: "tinh ha noi"
// console.log(output2); // Kết quả: "thanh pho ho chi minh"
// console.log(output3); // Kết quả: "cai rang"

// function removeProvinceOrCity(inputString) {
//   // Sử dụng biểu thức chính quy để tìm và loại bỏ "Tỉnh" hoặc "Thành phố" từ chuỗi
//   var result = inputString.replace(/(Tỉnh|Thành phố) /g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

//   return result
// }

// var inputString1 = "Tỉnh Hà Nội";
// var inputString2 = "Thành phố Hồ Chí Minh";
// var inputString3 = "Cái Răng";

// var output1 = removeProvinceOrCity(inputString1);
// var output2 = removeProvinceOrCity(inputString2);
// var output3 = removeProvinceOrCity(inputString3);

// console.log(output1); // Kết quả: "Hà Nội"
// console.log(output2); // Kết quả: "Hồ Chí Minh"
// console.log(output3); // Kết quả: "Cái Răng"

// function countFields(jsonObject) {
//   if (typeof jsonObject === 'object') {
//       return Object.keys(jsonObject).length;
//   } else {
//       return 0; // Không phải đối tượng JSON
//   }
// }

// // Một ví dụ về đối tượng JSON
// const data = {
//   "startDate": "2023-11-07",
//   "endDate": "2023-11-20",
//   "roomId": "a0W2t000008r0lLEAQ",
//   "totalRoom": "3"
// };

// const numberOfFields = countFields(data);
// console.log(`Số lượng trường trong đối tượng JSON là: ${numberOfFields}`);

// Dữ liệu ban đầu

const data = [
  {
      "Id": "a0U2t000004eyszEAA",
      "Name": "Mekong Delta Retreat",
      "Star__c": [
          1,
          2,
          3
      ],
      "Address__c": "456 Duong Van Don - Can Tho",
      "Description__c": "Nghi duong tai Mekong Delta Retreat tai Can Tho",
      "Image_Hotel__r": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/497698576.jpg?k=ac83d5020c09206087145bdc972c8b29dff9c12d51b448b58a931880cba1e946&o=&hp=1",
      "Room__r": {
          "Hotel_Id__c": "a0U2t000004eyszEAA",
          "Id": "a0W2t000008r0lLEAQ",
          "Room_Name__c": "Phòng thaongs mát có cửa sổ",
          "Price__c": 2000000,
          "Discount__c": 5,
          "Convenient__c": "24-hour front desk;Lift;Breakfast;Airport shuttle;Non-smoking rooms",
          "Room_Type__c": "Deluxe Room",
          "Room_Capacity__c": 3,
          "Total_Room__c": 6
      },
      "Convenient__c": [
          "24-hour front desk",
          "Airport shuttle"
      ]
  },
  {
      "Id": "a0U2t000004eysyEAA",
      "Name": "Starlight Beachfront Resort",
      "Star__c": [
          1,
          2,
          3,
          4,
          5
      ],
      "Address__c": "123 Duong Vo Nguyen Giap - Đa Nang",
      "Description__c": "Starlight Beachfront Resort tai Da Nang voi tam nhin hoan hao ve bien va dich vu 5 sao.",
      "Image_Hotel__r": "https://cf.bstatic.com/xdata/images/hotel/max1280x900/499221774.jpg?k=8d3d4f86cf3efc02d17baabd084ef842c95d405762bfe1a43d539755632b8274&o=&hp=1",
      "Room__r": {
          "Hotel_Id__c": "a0U2t000004eysyEAA",
          "Id": "a0W2t000008r0lkEAA",
          "Room_Name__c": "Phòng lớn có 2 giường",
          "Price__c": 699999,
          "Discount__c": 25,
          "Convenient__c": "Room service;24-hour front desk;Lift;Breakfast;Airport shuttle;Non-smoking rooms",
          "Room_Type__c": "Superior Room",
          "Room_Capacity__c": 4,
          "Total_Room__c": 4
      },
      "Convenient__c": [
          "Lift",
          "Non-smoking rooms"
      ]
  }
]

function sortByPrice(data) {
  // Sử dụng hàm sort để sắp xếp dữ liệu dựa trên trường 'Room__r.Price__c'
  data.sort((a, b) => {
    return a.Room__r.Price__c - b.Room__r.Price__c;
  });

  return data;
}

console.log(sortByPrice(data));