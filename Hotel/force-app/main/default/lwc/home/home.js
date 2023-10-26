import { LightningElement, track } from 'lwc';
import getProvinceData from "@salesforce/apex/ProvinceAPIController.getProvinceData";

export default class Home extends LightningElement { 
  @track selectedProvince;
  @track provinces;

    connectedCallback() {
        this.handleGetAllProvince()
    }

    handleProvinceChange(event) {
      this.selectedProvince = event.target.value;
      console.log(event.target.value);
    }
  
  handleGetAllProvince = () => {
    getProvinceData().then((result) => {
      this.provinces = JSON.parse(result);
    }).catch((err) => {
      console.error('Lỗi khi gọi API:', err);
    })
  }

  @track selectedStartDate = '';
    @track selectedEndDate = '';

    get minStartDate() {
        return new Date().toISOString().split('T')[0];
    }

    get defaultStartDate() {
        return new Date().toISOString().split('T')[0];
    }

    get defaultEndDate() {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 3);
        return currentDate.toISOString().split('T')[0];
    }

    get formattedStartDate() {
        return this.formatDate(this.defaultStartDate);
    }

    get formattedEndDate() {
        return this.formatDate(this.defaultEndDate);
    }

    handleStartDateChange(event) {
        this.selectedStartDate = event.target.value;
    }

    handleEndDateChange(event) {
        this.selectedEndDate = event.target.value;
    }

    formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }
}