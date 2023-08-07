import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TecApiService {
 

  private baseUrl = 'http://sistema.tecaquecedores.com.br/api';

  constructor(private http: HttpClient) { }

  // Método para fazer a requisição GET para o endpoint
  getUserData(endpointFeed: string): Observable<any> {
    //const endpointUrl = `${this.baseUrl}/api/blingUserData/marvinsenkiv@gmail.com`; // Substitua 'seu-endpoint' pelo caminho correto
    const endpointUrl = `${this.baseUrl}/blingUserData/${endpointFeed}`;
    return this.http.get<any>(endpointUrl);
  }

  getServices(): Observable<any> {
    //const endpointUrl = `${this.baseUrl}/api/blingUserData/marvinsenkiv@gmail.com`; // Substitua 'seu-endpoint' pelo caminho correto
    const endpointUrl = `${this.baseUrl}/symplebook/list-services`;
    return this.http.get<any>(endpointUrl);
  }

  getNextDate(): Observable<any> {
    //const endpointUrl = `${this.baseUrl}/api/blingUserData/marvinsenkiv@gmail.com`; // Substitua 'seu-endpoint' pelo caminho correto
    const endpointUrl = `${this.baseUrl}/symplebook/v2/next-date`;
    return this.http.get<any>(endpointUrl);
  }

  getSlotFromDate(data:string): Observable<any> {
    //const endpointUrl = `${this.baseUrl}/api/blingUserData/marvinsenkiv@gmail.com`; // Substitua 'seu-endpoint' pelo caminho correto
    const endpointUrl = `${this.baseUrl}/symplebook/v2/slot/${data}`;
    return this.http.get<any>(endpointUrl);
  }

  schedule(request:any): Observable<any> {
    //const endpointUrl = `${this.baseUrl}/api/blingUserData/marvinsenkiv@gmail.com`; // Substitua 'seu-endpoint' pelo caminho correto
    const endpointUrl = `${this.baseUrl}/symplebook/create/schedule?date=${request.date}&service_id=${request.serviceId}&period=${request.period}&document=${request.doc}&end=${request.selectedEnd} `;
    console.log('??', endpointUrl)
    return this.http.get<any>(endpointUrl);
  }


}
