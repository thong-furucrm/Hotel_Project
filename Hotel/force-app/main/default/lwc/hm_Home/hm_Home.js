import { LightningElement, track } from 'lwc';
import getProvinceData from "@salesforce/apex/HM_ProvinceAPIController.getProvinceData";
import getPickListConvenient from "@salesforce/apex/HM_RoomController.getPickListConvenient";
import getHotelsWithCheapestRooms from "@salesforce/apex/HM_RoomController.getHotelsWithCheapestRooms";

export default class Home extends LightningElement {
  @track selectedProvince;
  @track provinces;
  @track startDate;
  @track endDate;
  @track selectedStartDate = '';
  @track selectedEndDate = '';
  @track picklistConvenient;
  @track selectedCapacity
  @track selectedArranged;
  @track hotelsWithCheapestRooms;
  @track isShow
  @track isModalRoomDetails = false

  handleShowModalRoomDetails = () => {
    this.isModalRoomDetails = true
  }

  handleCloseModalRoomDetails = () => {
    this.isModalRoomDetails = false
  }

  connectedCallback() {
    this.handleGetAllProvince();
    this.defaultEndDate();
    this.defaultStartDate();
    this.handleGetAllPickListConvenient();
    this.handleGetHotelAndRoom();
  }

  handleGetHotelAndRoom = () => {
    getHotelsWithCheapestRooms().then((result) => {
      console.log('item: ' + result);
      const modifiedResult = result.map(item => {
        item.Star__c = Array.from({ length: item.Star__c }, (_, i) => i + 1);
        if (item.Image_Hotel__r || item.Room__r) {
          item.Image_Hotel__r = item.Image_Hotel__r[0].Image_Url__c;
          item.Room__r = item.Room__r[0]
          item.Convenient__c = this.randomConvenients(item.Room__r.Convenient__c)
        }
        return item;
      });
      this.hotelsWithCheapestRooms = modifiedResult;
      // console.log(this.hotelsWithCheapestRooms);
    }).catch((err) => {
      console.error('Lỗi khi get hotel and room:', err.mesage);
    })
  }

  randomConvenients = (conventients) => {
    const convenienceArray = conventients.split(";");

    // Random thứ tự của mảng
    for (let i = convenienceArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [convenienceArray[i], convenienceArray[j]] = [convenienceArray[j], convenienceArray[i]];
    }

    // Lấy chỉ 2 phần tử từ mảng
    const selectedConveniences = convenienceArray.slice(0, 2);
    return selectedConveniences;
  }

  handleProvinceChange(event) {
    this.selectedProvince = event.target.value;
    console.log(event.target.value);
  }

  handleCapacityChange = (event) => {
    this.selectedCapacity = event.target.value;
    console.log(event.target.value);
  }

  handleArrangedChange = (event) => {
    this.selectedArranged = event.target.value;
    console.log(event.target.value);
  }

  handleGetAllProvince = () => {
    getProvinceData().then((result) => {
      this.provinces = JSON.parse(result);
    }).catch((err) => {
      console.error('Lỗi khi gọi API:', err);
    })
  }

  handleGetAllPickListConvenient = () => {
    getPickListConvenient().then((result) => {
      this.picklistConvenient = result;
      console.log(result);
    }).catch((err) => {
      console.error('Lỗi khi get picklist convenient:', err);
    })
  }

  get minStartDate() {
    return new Date().toISOString().split('T')[0];
  }

  defaultStartDate = () => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date().toLocaleDateString('en-GB', options);
    this.startDate = formattedDate;
    console.log('start: ' + this.startDate);
  }

  defaultEndDate = () => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', options);
    this.endDate = formattedDate
    console.log('end: ' + this.endDate);
  }

  handleStartDateChange(event) {
    this.selectedStartDate = event.target.value;
  }

  handleEndDateChange(event) {
    this.selectedEndDate = event.target.value;
  }

  @track listRoom
  // details page
  handleDetailsPage = (event) => {
    this.isShow = true;
    console.log(event.target.dataset.value);

    getHotelsWithCheapestRooms().then((result) => {
      const modifiedResult = result.map(item => {
        item.Star__c = Array.from({ length: item.Star__c }, (_, i) => i + 1);
        item.Image_Hotel__r = item.Image_Hotel__r.map(record => record.Image_Url__c);
        item.Convenient__c = item.Room__r[0].Convenient__c.split(';');
        return item;
      });
      const rooms = modifiedResult[0].Room__r.map((room) => {
        room.discountPrice = room.Price__c - (room.Price__c * room.Discount__c / 100)
        return room
      })
      console.log(rooms);
      this.listRoom = modifiedResult[0].Room__r;
      // console.log(this.hotelsWithCheapestRooms);
    }).catch((err) => {
      console.error('Lỗi khi get hotel and room:', err.mesage);
    })
  }

  // table
  value = 'inProgress';

  get options() {
    return [
      { label: 'New', value: 'new' },
      { label: 'In Progress', value: 'inProgress' },
      { label: 'Finished', value: 'finished' },
    ];
  }

  handleChange(event) {
    this.value = event.detail.value;
  }
}