import { Injectable } from '@angular/core';
import {Camera,CameraPhoto, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Filesystem, Directory } from '@capacitor/filesystem';
import {Storage} from '@capacitor/storage';
import {Foto} from '../models/foto.interface';

@Injectable({
  providedIn: 'root'
})
export class FotoService {
//arreglo para almacenar fotos
  public fotos: Foto[]= [];
  private PHOTO_STORAGE: string = 'foros';

  constructor() { }

  //esta funcion va a ser llamada al hacer click en el icono de la camara
   public async addNewToGallery(){
    //proceso para tomar foto 
     
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri, //devuelve el identificador del recurso
      source: CameraSource.Camera, 
      quality: 100 //calidad de la imagen 100%
    });
 
    const savedImageFile = await this.savePicture(fotoCapturada);
    this.fotos.unshift(savedImageFile);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.fotos)
    })
  }
//guardo las imagenes en el sistema de archivos
  public async savePicture(cameraPhoto: CameraPhoto){
    //convierto la foto a fotmato base64
    const base64Data = await this.readAsBase64(cameraPhoto); 
    //escribo la foto en el directorio
    const fileName =  new Date().getTime + '.jpeg';
    const savedFile = await Filesystem.writeFile({path:fileName,data:base64Data,directory:Directory.Data});

    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };
  }

  public async readAsBase64(cameraPhoto: CameraPhoto){
    //convertir la imagen de blob a base64
    const response= await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
    
  }
  convertBlobToBase64 = (blob: Blob) =>  new Promise((resolve, reject) =>{
    const reader = new FileReader;
    reader.onerror= reject;
    reader.onload =() =>{
      resolve(reader.result);
    }
    reader.readAsDataURL(blob);
  })


public async loadSaved(){
  //recupero fotos de la cache
  const listaFotos =await Storage.get({key: this.PHOTO_STORAGE});
  this.fotos = JSON.parse(listaFotos.value) || []; //en el caso que no encuentre nada devuelve un arreglo vacio 

  //desplegar las fotos leidas en formato base64
  for(let foto of this.fotos){
    //leo cada foto almacenada en el sistema de archivos
    const readFile = await Filesystem.readFile({
      path: foto.filepath,
      directory: Directory.Data
    })
    //solo para formato web: cargar las fotos en base64
    foto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
  }

}

}

