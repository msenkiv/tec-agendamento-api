import { Component } from '@angular/core';
import { TecApiService } from '../tec-api.service';
import { Router } from '@angular/router';//import do roteamento
import { DataSharingService } from '../data-sharing.service';

import { ClientDTO } from '../dtos/Client';
import * as moment from 'moment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  endpointFeed: string = ''; //variavel que irá receber o valor do input
  errorMessage: string | null = null; //variavel recebe o texto de erro
  loading: boolean = false;
  syncMessage = ''

  constructor(
    private service: TecApiService,
    private router: Router,
    private dataSharingService: DataSharingService
  ) { }


  onLoginButtonClick() {
    this.fetchDataFromApi();
  }

  fetchDataFromApi() {

    const isCodeClient = /^\d{1,6}$/.test(this.endpointFeed);
    if (isCodeClient) {
      this.service.getUserByCode(this.endpointFeed).subscribe((data: any) => {
        if (data.length) {
          const filter = data
          this.dataSharingService.setSharedMultiClient(filter)
          localStorage.setItem('user', JSON.stringify(filter));
          this.router.navigate(['/inicio']);
        }
      },
        error => {
          console.error('error', error);
          this.errorMessage = 'Ocorreu um erro no sistema';//armazena a mensagem de erro na variavel        
        }
      )
    }
    else {
      this.service.getUserData(this.endpointFeed).subscribe(
        (data: any[]) => {
          console.log('Resultado API', data);
          // @ts-ignore
          if (data.contato) {
            // @ts-ignore
            this.dataSharingService.setSharedMultiClient([data.contato])
            // @ts-ignore
            localStorage.setItem('user', JSON.stringify([data.contato]));

            this.router.navigate(['/inicio']);
          } else if (data.length) {
            const filter = data.map(item => item.contato);
            this.dataSharingService.setSharedMultiClient(filter)
            localStorage.setItem('user', JSON.stringify(filter));
            this.router.navigate(['/inicio']);

          } else {
            this.errorMessage = '*Email ou documento não cadastrado'
          }
        },
        error => {
          console.error('error', error);
          this.errorMessage = 'Ocorreu um erro no sistema';//armazena a mensagem de erro na variavel        
        }
      );
    }

  }

  sync() {
    const today = moment();

    // Criando a startDate como hoje - 1 dia
    const startDate = moment(today).subtract(1, 'days');

    // Formatando as datas no formato "DD/MM/YYYY"
    const startDateString = startDate.format('DD/MM/YYYY');
    const finalDateString = today.format('DD/MM/YYYY');
    this.loading = true;
    this.service.importacaoJob(startDateString, finalDateString).subscribe((data) => {
      this.syncMessage = data.response;
      this.loading = false
    }, (error) => {
      console.log('e', error);
      this.loading = false
    })
  }

}

