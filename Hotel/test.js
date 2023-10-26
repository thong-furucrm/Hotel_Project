// URL của API tỉnh thành Việt Nam


// Sử dụng fetch để gọi API
fetch('https://provinces.open-api.vn/api/p/')
  .then(response => response.json())
  .then(data => {
    // Lặp qua dữ liệu và in ra tên tỉnh, thành phố
    data.forEach(province => {
      console.log(province.name);
    });
    console.log(data.length);
  })
  .catch(error => {
    console.error('Lỗi khi gọi API:', error);
  });
