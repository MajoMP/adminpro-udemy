import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Hospital } from '../../models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';

import swal from 'sweetalert';


@Injectable()
export class HospitalService {

  token: string;
  hospital: Hospital;

  totalHospitales: number = 0;

  constructor(public http: HttpClient,
              public usuarioService: UsuarioService) { }

  cargarHospitales() {
    let url = URL_SERVICES + '/hospital';
    return this.http.get(url)
            .map((resp: any) => {
              this.totalHospitales = resp.total;
              return resp.hospitales;
            });
  }

  obtenerHospital( idHospital: string ) {
    let url = URL_SERVICES + '/hospital/' + idHospital;
    return this.http.get(url)
               .map( (resp: any) => {
                 return resp.hospital;
               });
  }

  borrarHospital( idHospital: string ) {
    let url = URL_SERVICES + '/hospital/' + idHospital;
    url += '?token=' + this.usuarioService.token;

    return this.http.delete(url)
               .map( (resp) => {
                 swal('Hospital borrado', 'El hospital ha sido eliminado correctamente', 'success');
                 return true;
               });
  }

  crearHospital( nombre: string ) {
    let url = URL_SERVICES + '/hospital';
    url += '?token=' + this.usuarioService.token;

    return this.http.post(url, {nombre: nombre})
              .map( (resp: any) => {
                swal('Hospital creado', nombre, 'success');
                return resp.hospital;
              });
  }

  buscarHospital( termino: string ) {
    let url = URL_SERVICES + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
               .map( (resp: any) => {
                 return resp.hospitales;
               });
  }

  actualizarHospital( hospital: Hospital ) {
    let url = URL_SERVICES + '/hospital/' + hospital._id;
    url += '?token=' + this.usuarioService.token;

    return this.http.put(url, hospital)
               .map( (resp: any) => {
                 swal('Hospital actualizado', hospital.nombre, 'success');
                  return true;
               });
  }

}
