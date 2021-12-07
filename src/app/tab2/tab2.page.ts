import { Component } from '@angular/core';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  //importo el servicio 
  constructor(public fotoService: FotoService) {}

  addPhotoToGallery(){
    this.fotoService.addNewToGallery();
  }
  //esta funcion se ejecuta una sola vez cuando carga la pagina
  async ngOnInit(){
    await this.fotoService.loadSaved();
  }
}
