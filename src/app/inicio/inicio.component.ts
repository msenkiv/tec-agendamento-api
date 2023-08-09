import { Component, OnInit } from '@angular/core';
import { DataSharingService } from '../data-sharing.service';//import do serviço
import { ClientDTO } from '../dtos/Client';
import { NavigationExtras, Router } from '@angular/router';
import { TecApiService } from '../tec-api.service';
import { ServicosDto } from '../dtos/Servico';
import * as moment from 'moment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})


export class InicioComponent implements OnInit {

  loading:boolean = false;
  client!: ClientDTO[];
  clientName: String = '';
  clientEmail: String = '';
  clientTel: String = '';
  clientCel: String = '';
  services: string[] = ['Service 1', 'Service 2', 'Service 3', 'Service 4'];
  services2: ServicosDto[] = [];
  nextDateText: any = {};
  selectedService: string | null = '';
  selectedDate: any;
  minDate: string;
  selectedAddress: string = '';
  noDateAvaliabe: boolean = false;
  selectedPeriod: number = 0;
  error:boolean = false;
  missingFields:string = '';

  morning: boolean = false;
  afternoon: boolean = false;
  integral: boolean = false;

  constructor(private dataSharingService: DataSharingService, private router: Router, private service: TecApiService,) {
    const today = new Date();
    this.minDate = today.toISOString().slice(0, 10);
  }

  ngOnInit() {
    this.loading = true;
    const userStorage = localStorage.getItem('user');
    const user = userStorage ? JSON.parse(userStorage) : [];

    this.client = user;
    if (!this.client.length) {
      this.router.navigate(['/']);
    }

    this.clientName = this.client[0].nome;
    this.clientEmail = this.client[0].email;
    this.clientTel = this.client[0].fone;
    this.clientCel = this.client[0].celular;
    this.selectedAddress = this.client[0].id;

    this.loadServices();
    this.loadNextDate();
  }

  loadServices() {
    this.service.getServices().subscribe(data => {
      console.log('feito', data)

      if (data.length) {
        console.log(data)
        this.services2 = data;
      }
    });
  }

  loadNextDate() {
    this.service.getNextDate().subscribe(data => {
      if (data) {
        this.nextDateText = data;
      } 
      this.loading = false;
    })
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  editEnd() {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: this.selectedAddress },
      // Alternatively, you can use the following to pass it as a route parameter:
      // state: { id: id },
    };
    this.router.navigate(['/editar'], navigationExtras);
  }

  isSelected(dateText: any): boolean {
    if (this.selectedDate === dateText) {
      this.morning = false;
      this.afternoon = false;
      this.integral = false;
    }
    return this.selectedDate === dateText;
  }

  toggleSelection(dateText: any) {
    if (this.isSelected(dateText)) {
      this.selectedDate = null;
    } else {
      this.selectedDate = dateText;
    }
  }

  onDateChange() {
    // Função que será chamada quando a data for alterada
    console.log('Data selecionada:', this.selectedDate);
    this.service.getSlotFromDate(this.selectedDate).subscribe(
      (date) => {
        console.log('ue', date)
        //@ts-ignore
        if (!date) {
          console.log('erririririr')
          this.noDateAvaliabe = true;
          this.morning = false;
          this.afternoon = false;
          this.integral = false;
          return;
        }
        if (date?.manha?.length) {
          console.log('::::')
          this.morning = true;
        }
        if (date?.tarde?.length) {
          this.afternoon = true;
        }
        if (date?.tarde?.length || date?.manha?.length) {
          this.integral = true;
        }
        this.noDateAvaliabe = false;


      }
    )
    // Chamada de outras funções ou lógica adicional aqui...
  }

  // Method to handle selecting a service
  selectService(service: string) {
    this.selectedService = service;
  }

  selectPeriod(period: number) {
    this.selectedPeriod = period;
  }

  agendar() {
    const idx = this.findIndexById(this.client, this.selectedAddress);
    if(!this.client[idx].cnpj && !this.client[idx].email){
       this.missingFields = 'Este usuário não tem EMAIL nem CNPJ cadastrado. Não é possível agendar';
    }
    let document = this.client[idx].cnpj;
    if(!document){
      document = this.client[idx].email;
    }
    let cleanedDocument;
    if(document){
      cleanedDocument = document.replace(/[.-]/g, '');
    }

    const end = (this.findIndexById(this.client, this.selectedAddress) + 1);
    const period = this.getPeriod(this.selectedDate)
    const request = {
      selectedEnd: end,
      serviceId: this.selectedService,
      date: this.selectedDate?.date ? this.selectedDate.date : this.formatDateToDDMMYYYY(this.selectedDate),
      period: period,
      doc: cleanedDocument
    }

    console.log('kddd', request)

   const missingFields = this.checkObjectForEmptyFields(request);

   if(missingFields){
      this.error = true;
      setTimeout(()=>{
        this.error = false
      },2000)
   }

    if(!missingFields){
      this.loading = true;
      this.service.schedule(request).subscribe(
        (data) =>{
          this.loading = true;
          if(data){
            this.router.navigate(['/success'])
          } else{
            this.error = true;
          }

        }
      )
    }

  }

  //@ts-ignore
  getPeriod(date) {
    if (date?.time) {
      return date?.time == 'manhã' ? 1 : 2;
    }
    return this.selectedPeriod;
  }

  //@ts-ignore
  findIndexById(array, id) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        return i; // Retorna o índice do objeto com o id correspondente
      }
    }
    return -1; // Retorna -1 se o id não for encontrado no array
  }

  //@ts-ignore
  checkObjectForEmptyFields(obj) {
    for (const key in obj) {
      console.log('WTFFF', key, obj)
      if(obj[key] == undefined){
        return true
      }
      if(obj[key] == 0){
        return true
      }
      if (typeof obj[key] === 'string' && obj[key].trim() === '' ) {
        console.log('wttfff??')
        return true;
      }
    }
  }

  formatDateToDDMMYYYY(inputDate: string): string | null {
    if (!inputDate) {
      return null;
    }
  
    const selectedDate = moment(inputDate);
    return selectedDate.format('DD/MM/YYYY');
  }

}
