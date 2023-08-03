import { Component } from '@angular/core';
import { TecApiService } from '../tec-api.service';
import { Router } from '@angular/router';//import do roteamento
import { DataSharingService } from '../data-sharing.service';

import { ClientDTO } from '../dtos/Client';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {  

  
  endpointFeed: string= ''; //variavel que irá receber o valor do input
  errorMessage: string | null = null; //variavel recebe o texto de erro

  constructor(
    private service: TecApiService, 
    private router: Router,
    private dataSharingService: DataSharingService
  ) {}

  
  onLoginButtonClick() {
    this.fetchDataFromApi();
  }

  fetchDataFromApi() {
    console.log('WRTFFF')
    this.service.getUserData(this.endpointFeed).subscribe(
      (data: any[]) => {        
        console.log('Resultado API',data);
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
