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

// const result = [
//   {
//       "Id": "a0U2t000004eystEAA",
//       "Name": "City Plaza Hotel",
//       "Star__c": 4,
//       "Address__c": "23 Nguyen Du - Quan Hai Ba Trung - Ha Noi",
//       "Image_Hotel__r": [
//           {
//               "Hotel_Id__c": "a0U2t000004eystEAA",
//               "Id": "a0V2t000007QYXVEA4",
//               "Image_Url__c": "https://cf.bstatic.com/xdata/images/hotel/square200/463436589.webp?k=6ec406f898767976fddc88f5023af7c7a11b2eb501564b3a81dbea611ac0d3cb&o="
//           }
//       ],
//       "Room__r": [
//           {
//               "Hotel_Id__c": "a0U2t000004eystEAA",
//               "Id": "a0W2t000008qzb6EAA",
//               "Room_Name__c": "Superior Riverside View Room",
//               "Price__c": 500000,
//               "Discount__c": 5
//           }
//       ]
//   }
// ]

// const modifiedResult = result.map(item => {
//   item.Star__c = Array.from({ length: item.Star__c }, (_, i) => i + 1);
//   item.Image_Hotel__r = item.Image_Hotel__r[0].Image_Url__c;
//   item.Room__r = item.Room__r[0]
//   return item;
// });

// console.log(modifiedResult);

// Chuỗi ban đầu
const Convenient__c = "Room service;24-hour front desk;Lift;Breakfast;Airport shuttle;Non-smoking rooms";

// Cắt chuỗi thành mảng bằng dấu chấm phẩy
const convenienceArray = Convenient__c.split(";");

// Random thứ tự của mảng
for (let i = convenienceArray.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [convenienceArray[i], convenienceArray[j]] = [convenienceArray[j], convenienceArray[i]];
}

// Lấy chỉ 2 phần tử từ mảng
const selectedConveniences = convenienceArray.slice(0, 2);

// In ra 2 phần tử đã chọn
console.log(selectedConveniences);

