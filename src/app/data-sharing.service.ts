import { Injectable } from '@angular/core';
import { ClientDTO } from './dtos/Client'; // Assuming you have created the ClientDTO interface

@Injectable({
    providedIn: 'root',
})
export class DataSharingService {

    private sharedClient!: ClientDTO;
    private sharedMultiClient!: ClientDTO[];

    setSharedClient(data: ClientDTO) {
        this.sharedClient = data;
    }

    getSharedClient(): ClientDTO {
        return this.sharedClient;
    }

    setSharedMultiClient(data: ClientDTO[]) {
        this.sharedMultiClient = data;
    }

    getSharedMultiClient(): ClientDTO[] {
        return this.sharedMultiClient;
    }
}
