/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getProvinceData from "@salesforce/apex/HM_ProvinceAPIController.getProvinceData";
import getHotelsWithCheapestRooms from "@salesforce/apex/HM_RoomController.getHotelsWithCheapestRooms";
import getRoomDetails from "@salesforce/apex/HM_RoomController.getRoomDetails";
import getRoomBooking from "@salesforce/apex/HM_RoomController.getRoomBooking";
import getPaginatedHotels from "@salesforce/apex/HM_RoomController.getPaginatedHotels";
import getListConvenient from "@salesforce/apex/HM_RoomController.getListConvenient";
import getBookingByDate from "@salesforce/apex/HM_RoomController.getBookingByDate";
import createBooking from "@salesforce/apex/HM_RoomController.createBooking";
import findRoomByDate from "@salesforce/apex/HM_RoomController.findRoomByDate";
// import filterHotelByDate from "@salesforce/apex/HM_RoomController.filterHotelByDate";
import getAllHotel from "@salesforce/apex/HM_RoomController.getAllHotel";
// { province: this.removeProvinceOrCity(this.selectedProvince), startDate: this.selectedStartDate, capacity: 2, convenients: this.checkBoxSelected, sortHotel: '',
// pageNumber: this.pageNumber, pageSize: this.pageNumber
export default class Home extends LightningElement {
  @track selectedProvince = null;
  @track provinces;
  @track selectedStartDate = null;
  @track selectedEndDate = '';
  @track picklistConvenient;
  @track selectedCapacity = null;
  @track selectedArranged;
  @track hotelsWithCheapestRooms;
  @track displayDetailsPage
  @track isModalRoomDetails = false
  @track roomDetails;
  @track isModalBooking
  @track displayDashboard = true
  @track roomBooking
  @track checkBoxSelected = []
  @track displayBreadcrumb = false
  @track totalHotel;
  @track displayModalCapacity = false;

  connectedCallback() {
    this.handleGetAllPickListConvenient();
    this.getProvices();
    this.loadHotels();
    this.handleDemo();
  }

  // Dashboard
  handleGetAllPickListConvenient = () => {
    getListConvenient().then((result) => {
      this.picklistConvenient = result;
    }).catch((err) => {
      console.error('Lỗi khi get picklist convenient:', err);
    })
  }

  get minStartDate() {
    return new Date().toISOString().split('T')[0];
  }

  handleStartDateChange(event) {
    this.selectedStartDate = event.target.value;
    console.log(this.selectedStartDate);
  }

  handleEndDateChange(event) {
    this.selectedEndDate = event.target.value;
    console.log(this.selectedEndDate);
  }

  handleGetCheckbox(e) {
    this.checkBoxSelected = e.detail.value;
    this.loadHotels()
  }

  @track pageNumber = 1;
  @track pageSize = 2;
  @track hotels = [];
  @track totalPages = 1;
  @track pages = [];
  @track displayPagination = false;

  sortByPrice(data) {
    data.sort((a, b) => {
      return a.Room__r.Price__c - b.Room__r.Price__c;
    });
    return data;
  }

  sortByPriceDESC(data) {
    data.sort((a, b) => {
      return b.Room__r.Price__c - a.Room__r.Price__c;
    });
    return data;
  }

  // demo
  handleDemo() {
    // String province, String startDate, Integer capacity, List<String> convenients, String sortHotel, 
    //                                         Integer pageNumber, Integer pageSize
    getAllHotel({ province: this.removeProvinceOrCity(this.selectedProvince), startDate: this.selectedStartDate, capacity: this.selectedCapacity, convenients: this.checkBoxSelected, totalRoomBooking: this.totalRoomBooking, pageNumber: this.pageNumber, pageSize: this.pageSize }).then((result) => {
      console.log('demo ------------------------------');
      let hotelNotExits = false;
      result.hotels.map((hotel) => {
        if (hotel.Room__r.length != 0) {
          hotelNotExits = true;
        }
      })
      if (hotelNotExits) {
        console.log('co phong nao trong');
        console.log(result);
      } else {
        console.log('khong co phong trong');
        console.log(result);
      }
    }).catch((err) => {
      console.error('Lỗi khi get demo:', err.message);
    })
  }

  loadHotels() {
    console.log(this.checkBoxSelected);
    console.log('call loading hotel');
    console.log('selected province: ' + this.selectedProvince);
    // String province, String startDate, Integer capacity, List<String> convenients, Integer totalRoomBooking, Integer pageNumber, Integer pageSize
    // getPaginatedHotels({ pageNumber: this.pageNumber, pageSize: this.pageSize, convenients: this.checkBoxSelected, province: this.removeProvinceOrCity(this.selectedProvince), orderByHotel: orderByHotel, orderByRoom: orderByRoom })
    getAllHotel({ province: this.removeProvinceOrCity(this.selectedProvince), startDate: this.selectedStartDate, capacity: this.selectedCapacity, convenients: this.checkBoxSelected, totalRoomBooking: this.totalRoomBooking, pageNumber: this.pageNumber, pageSize: this.pageSize })
      .then(result => {
        console.log('loading hotel...');
        console.log(result);
        // format data
        const modifiedResult = result.hotels.map((item) => {
          item.Star__c = Array.from({ length: item.Star__c }, (_, i) => i + 1);
          if (item.Image_Hotel__r || item.Room__r) {
            item.Image_Hotel__r = item.Image_Hotel__r[0].Image_Url__c;
            console.log(item.Room__r[0]);
            item.Room__r = item.Room__r[0]
            item.Convenient__c = this.randomConvenients(item.Room__r.Convenient__c)
          }
          return item;
        });

        // sort by price
        let transformedData
        if (this.selectedArranged == '1') {
          transformedData = this.sortByPrice(modifiedResult);
          console.log(transformedData);
          this.hotelsWithCheapestRooms = transformedData
        }
        if (this.selectedArranged == '2') {
          transformedData = this.sortByPriceDESC(modifiedResult);
          console.log(transformedData);
          this.hotelsWithCheapestRooms = transformedData
        } else {
          this.hotelsWithCheapestRooms = modifiedResult;
        }
        // end sort by price

        // display pagination
        this.hotels = result.hotels;
        this.totalPages = result.totalPages
        if (result.totalPages > 1) {
          this.displayPagination = true
          this.generatePageNumbers()
        } else {
          this.displayPagination = false
        }
        this.totalHotel = this.totalPages * this.pageSize
        console.log('totalPages: ' + this.totalPages);
      })
      .catch(error => {
        console.error('Error loading hotels:', error.message);
      });
  }

  handleSearchHotel() {
    console.log('click search icon');
    if (this.selectedProvince != null) {
      this.displayBreadcrumb = true
      this.loadHotels();
      this.handleDemo();
    } else {
      this.handleShowToastMsg('Search hotel', 'Vui lòng chọn địa chỉ bạn muốn đi', 'error')
    }
  }

  handleGetBooking() {
    console.log('click handle get booking');
    getBookingByDate({ startDate: startDate }).then((result) => {
      console.log('handle get booking date');
      console.log(result);
    }).catch((err) => {
      console.error('Lỗi khi gọi API get booking:', err.message);
    })
  }

  @track arrangeSelected = 'Hotel mới nhất'
  get arrange() {
    return [
      { label: 'Giá từ thấp đến cao', value: '1' },
      { label: 'Giá từ cao đến thấp', value: '2' },
      { label: 'Hotel mới nhất', value: '3' },
    ];
  }

  handleArrangedChange = (event) => {
    this.selectedArranged = event.target.value;
    console.log(event.target.value);
    this.handleSearchHotel()
  }



  // Detail page
  @track listRoom
  @track hotelDetails
  @track defaultImage
  @track roomNumber = 0
  @track idHotelSelected
  handleDetailsPage = (event) => {
    console.log('Details page');
    this.displayDetailsPage = true;
    this.displayDashboard = false
    this.idHotelSelected = event.target.dataset.value
    console.log(event.target.dataset.value);

    getHotelsWithCheapestRooms({ idHotel: event.target.dataset.value }).then((result) => {
      console.log(result);
      this.defaultImage = result.Image_Hotel__r[0].Image_Url__c
      result.Star__c = Array.from({ length: result.Star__c }, (_, i) => i + 1);
      result.Convenient__c = result.Room__r[0].Convenient__c.split(';');
      this.hotelDetails = result
      this.handleFindRoom();
      console.log(this.defaultImage);
      console.log(this.hotelDetails);

      this.listRoom = result.Room__r.map((room) => {
        room.discountPrice = room.Price__c - (room.Price__c * room.Discount__c / 100)
        room.roomNumber = Array.from({ length: room.Total_Room__c }, (_, i) => i + 1);
        return room
      })
      console.log("list room");
      console.log(this.listRoom);
    }).catch((err) => {
      console.error('Lỗi khi get hotel and room:', err.mesage);
    })
  }

  handleChangeImage(event) {
    console.log('id image: ' + event.target.dataset.value);
    this.defaultImage = event.target.dataset.value;
    this.handleDetailsPage();
  }

  handleGetRoomNumber(event) {
    this.roomNumber = event.target.value
    console.log('room number1: ' + event.target.value);
  }

  handleFindRoom() {
    console.log('handle find room');
    console.log(this.idHotelSelected, this.selectedStartDate, this.selectedEndDate, this.selectedCapacity);
    if (this.idHotelSelected && this.selectedStartDate && this.selectedEndDate) {
      findRoomByDate({ hotelId: this.idHotelSelected, startDate: this.selectedStartDate, capacity: this.selectedCapacity }).then((result) => {
        console.log(result);
        this.listRoom = result.map((room) => {
          room.discountPrice = room.Price__c - (room.Price__c * room.Discount__c / 100)
          room.roomNumber = Array.from({ length: room.Total_Room__c }, (_, i) => i + 1);
          return room
        })
        if (this.listRoom.length == 0) {
          this.isModalBooking = false;
          this.handleShowToastMsg('Find room', `Đã hết phòng cho ngày ${startDate}, quý khách vui lòng booking trước ngày ${this.selectedStartDate} hoặc sau ngày ${this.selectedEndDate}`, 'error')
        }
        console.log(this.listRoom);
      }).catch((err) => {
        console.error('Lỗi khi find room:', err.message);
      })
    } else {
      this.handleShowToastMsg('Find room', 'Vui lòng nhập tất cả các trường tìm kiếm', 'error')
    }
  }

  // get capacity() {
  //   return [
  //     { label: 'Số Người 1, Số Phòng 1', value: '1' },
  //     { label: 'Số Người 2, Số Phòng 1', value: '2' },
  //     { label: 'Số Người 3, Số Phòng 1', value: '3' },
  //   ];
  // }

  handleClickCapacity = () => {
    // this.selectedCapacity = event.detail.value;
    // console.log(event.detail.value);
    this.displayModalCapacity = true
  }

  handleCloseModalCapacity() {
    this.displayModalCapacity = false
    console.log('click handle get capacity');
  }

  // @track audults
  handleGetAdults(event) {
    console.log(event.target.value);
    this.selectedCapacity = event.target.value
  }

  @track totalRoomBooking
  handleGetRooms(event) {
    console.log('roooms' + event.target.value);
    this.totalRoomBooking = event.target.value
  }



  // Detail room
  @track idRoomSelected
  handleShowModalRoomDetails = (event) => {
    this.isModalRoomDetails = true
    console.log('id room: ' + event.target.dataset.value);
    this.idRoomSelected = event.target.dataset.value

    getRoomDetails({ idRoom: event.target.dataset.value }).then((result) => {
      result.Convenient__c = result.Convenient__c.split(';');
      // console.log('list images room');
      // console.log(result);
      // console.log(result.Image_Room__r);
      this.roomDetails = result;
      // console.log(this.roomDetails);
    }).catch((err) => {
      console.error('Lỗi khi get images room:', err.mesage);
    })
  }

  handleCloseModalRoomDetails = () => {
    this.isModalRoomDetails = false
  }


  // Booking
  handleModalBooking = (event) => {
    this.handleFindRoom();
    console.log('id room: ' + event.target.dataset.value);
    this.idRoomSelected = event.target.dataset.value
    if (this.roomNumber != 0 && this.selectedStartDate && this.selectedEndDate) {
      this.isModalBooking = true;
      this.isModalRoomDetails = false;
      // this.displayDetailsPage = false;
      getRoomBooking({ idRoom: event.target.dataset.value }).then((result) => {
        let room = {}
        console.log('click booking');
        console.log(result);
        result.map((item) => {
          if (item.Room__r) {
            room.discountPrice = item.Room__r[0].Price__c - (item.Room__r[0].Price__c * item.Room__r[0].Discount__c / 100)
            room.price = item.Room__r[0].Price__c
            room.address = item.Address__c
            room.nameHotel = item.Name
            room.roomSelected = item.Room__r[0].Room_Type__c
            room.stay = this.numberOfStay(this.selectedStartDate, this.selectedEndDate)
            this.roomBooking = room;
            return;
          }
        })
        console.log(this.roomBooking);
      }).catch((err) => {
        console.error('Lỗi khi get images room:', err.mesage);
      })
    } else {
      this.handleShowToastMsg('Booking room', 'Vui lòng chọn phòng hoặc ngày bắt dầu và kết thúc.', 'error')
    }
  }

  numberOfStay(startDate, endDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const timeDifference = endDateObj - startDateObj;
    const numberOfNights = timeDifference / (1000 * 60 * 60 * 24);
    return numberOfNights;
  }

  @track fname
  @track lName
  @track email
  @track phone
  @track estimateTime

  handleGetFirstName(event) {
    this.fname = event.target.value
    console.log(event.target.value);
  }

  handleGetLastName(event) {
    this.lName = event.target.value
    console.log(event.target.value);
  }

  handleGetEmail(event) {
    this.email = event.target.value
    console.log(event.target.value);
  }

  handleGetPhone(event) {
    this.phone = event.target.value
    console.log(event.target.value);
  }

  handleGetEstimateTime(event) {
    this.estimateTime = event.target.value
    console.log(event.target.value);
  }

  handleBookingRoom() {
    console.log('handle booking room');
    const contact = { firstName: this.fname, lastName: this.lName, email: this.email, phone: this.phone, startDate: this.selectedStartDate, endDate: this.selectedEndDate, roomId: this.idRoomSelected, totalRoom: this.roomNumber }
    console.log(contact);
    if (this.fname && this.lName && this.email && this.phone && this.selectedStartDate && this.selectedEndDate && this.idRoomSelected && this.roomNumber) {
      createBooking(contact).then((result) => {
        if (result) {
          this.handleShowToastMsg('Booking room', 'Booking room successfully', 'success')
          this.handleCloseModalBooking();
        } else {
          this.handleShowToastMsg('Booking room', 'Booking room false', 'error')
        }
      }).catch((err) => {
        console.error('Lỗi khi booking room:', err);
      })
    } else {
      this.handleShowToastMsg('Booking room', 'Vui lòng nhập các trường có dấu *', 'error')
    }
  }

  handleCloseModalBooking() {
    this.isModalBooking = false;
  }



  // API Province
  getProvices() {
    getProvinceData().then((result) => {
      const listProvince = JSON.parse(result).map((item) => {
        return { label: item.name, value: item.name }
      })
      this.provinces = listProvince
    }).catch((err) => {
      console.error('Lỗi khi gọi API Province:', err);
    })
  }

  handleProvinceChange(event) {
    this.selectedProvince = event.target.value;
    // this.loadHotels();
    console.log('handle province change: ' + this.removeProvinceOrCity(event.target.value));
  }



  // Pagination
  // @track pageNumber = 1;
  // @track pageSize = 2;
  // @track hotels = [];
  // @track totalPages = 1;
  // @track pages = [];
  // @track displayPagination = false;

  // loadHotels() {
  //   let orderByHotel = 'ORDER BY CreatedDate DESC'
  //   let orderByRoom = ''
  //   if (this.selectedArranged == 1) {
  //     orderByRoom = 'ORDER BY Price__c'
  //     orderByHotel = ''
  //   }
  //   if (this.selectedArranged == 2) {
  //     orderByRoom = 'ORDER BY Price__c DESC'
  //     orderByHotel = ''
  //   }
  //   console.log(this.checkBoxSelected);
  //   getPaginatedHotels({ pageNumber: this.pageNumber, pageSize: this.pageSize, convenients: this.checkBoxSelected, province: this.removeProvinceOrCity(this.selectedProvince), orderByHotel: orderByHotel, orderByRoom: orderByRoom })
  //     .then(result => {
  //       console.log('loading hotel...');
  //       console.log(result);
  //       const modifiedResult = result.hotels.map((item, index) => {
  //         item.Star__c = Array.from({ length: item.Star__c }, (_, i) => i + 1);
  //         if (item.Image_Hotel__r || item.Room__r) {
  //           item.Image_Hotel__r = item.Image_Hotel__r[0].Image_Url__c;
  //           console.log(item.Room__r[0]);
  //           item.Room__r = item.Room__r[0]
  //           item.Convenient__c = this.randomConvenients(item.Room__r.Convenient__c)
  //         }
  //         return item;
  //       });
  //       this.hotelsWithCheapestRooms = modifiedResult;
  //       this.hotels = result.hotels;
  //       this.totalPages = result.totalPages
  //       if (result.totalPages > 1) {
  //         this.displayPagination = true
  //         this.generatePageNumbers()
  //       } else {
  //         this.displayPagination = false
  //       }
  //       this.totalHotel = this.totalPages * this.pageSize
  //       console.log('totalPages: ' + this.totalPages);
  //     })
  //     .catch(error => {
  //       console.error('Error loading hotels:', error.message);
  //     });
  // }

  generatePageNumbers() {
    const listPage = []
    for (let i = 1; i <= this.totalPages; i++) {
      let isActive;
      if (this.pageNumber == i) {
        isActive = 'active'
      } else {
        isActive = ''
      }
      listPage.push({ page: i, isActive: isActive })
    }
    this.pages = listPage
  }

  handleNextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadHotels();
    }
  }

  handlePreviousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadHotels();
    }
  }

  handleGetHotelByPage(event) {
    this.pageNumber = event.target.dataset.value
    this.loadHotels();
  }



  // Helper
  removeProvinceOrCity(inputString) {
    const result = inputString && inputString.replace(/(Tỉnh|Thành phố) /g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return result
  }

  countFields(jsonObject) {
    if (typeof jsonObject === 'object') {
      return Object.keys(jsonObject).length;
    } else {
      return 0; // Không phải đối tượng JSON
    }
  }

  // variantOptions = ["error", "warning", "success", "info"];
  handleShowToastMsg(title, msg, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: msg,
      variant: variant,
    });
    this.dispatchEvent(evt);
  }

  randomConvenients = (conventients) => {
    const convenienceArray = conventients.split(";");
    for (let i = convenienceArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [convenienceArray[i], convenienceArray[j]] = [convenienceArray[j], convenienceArray[i]];
    }
    // Lấy 2 convenient để hiển thị trên dashboard
    const selectedConveniences = convenienceArray.slice(0, 2);
    return selectedConveniences;
  }

  transformData(inputData, maxItems, arranged) {
    console.log('tranform data arranged: ', arranged);
    const hotels = [];
    for (const item of inputData) {
      if (!item.Room__r) {
        continue;
      }
      const hotel = {
        Id: item.Id,
        Name: item.Name,
        Star__c: Array.from({ length: item.Star__c }, (_, i) => i + 1),
        Address__c: item.Address__c,
        Description__c: item.Description__c,
        Image_Hotel__r: item.Image_Hotel__r[0]?.Image_Url__c,
        Room__r: {
          Hotel_Id__c: item.Room__r[0]?.Hotel_Id__c,
          Id: item.Room__r[0]?.Id,
          Room_Name__c: item.Room__r[0]?.Room_Name__c,
          Price__c: item.Room__r[0]?.Price__c,
          Discount__c: item.Room__r[0]?.Discount__c,
          Convenient__c: item.Room__r[0]?.Convenient__c,
          Room_Type__c: item.Room__r[0]?.Room_Type__c,
          Room_Capacity__c: item.Room__r[0]?.Room_Capacity__c,
          Total_Room__c: item.Room__r[0]?.Total_Room__c,
        },
        Convenient__c: this.randomConvenients(item.Room__r[0]?.Convenient__c),
      };
      hotels.push(hotel);
    }

    if (arranged) {
      hotels.sort((a, b) => (a.Room__r.Price__c || 0) - (b.Room__r.Price__c || 0));
    } else {
      hotels.sort((a, b) => (b.Room__r.Price__c || 0) - (a.Room__r.Price__c || 0));
    }

    return { hotels: hotels.slice(0, maxItems), totalPages: 5 };
  }
}