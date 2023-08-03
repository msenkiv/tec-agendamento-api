import { Component } from '@angular/core';
import { ClientDTO } from '../dtos/Client';

@Component({
  selector: 'app-edit-endereco',
  templateUrl: './edit-endereco.component.html',
  styleUrls: ['./edit-endereco.component.css']
})
export class EditEnderecoComponent {
  client!: ClientDTO[];
  selectedAddress: any = null;

  ngOnInit(){
    const userStorage = localStorage.getItem('user');
    const user = userStorage? JSON.parse(userStorage) : [];

    this.client = user;
  }

  editAddress(addressId: number) {

  }

  saveChanges() {

    this.selectedAddress = null;
  }
}
