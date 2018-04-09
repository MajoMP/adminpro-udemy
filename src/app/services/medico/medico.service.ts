import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { Medico } from '../../models/medico.model';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable()
export class MedicoService {

  token: string;
  medico: Medico;

  totalMedicos: number = 0;

  constructor(public http: HttpClient,
              public usuarioService: UsuarioService) { }


  cargarMedicos() {
    let url = URL_SERVICES + '/medico';
    return this.http.get(url)
            .map((resp: any) => {
              this.totalMedicos = resp.total;
              return resp.medicos;
            });
  }

  cargarMedico(idMedico: string) {
    let url = URL_SERVICES + '/medico/' + idMedico;
    return this.http.get(url)
            .map((resp: any) => {
              return resp.medico;
            });
  }

  buscarMedico( termino: string ) {
    let url = URL_SERVICES + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
               .map( (resp: any) => {
                 return resp.medicos;
               });
  }

  borrarMedico( idMedico: string ) {
    let url = URL_SERVICES + '/medico/' + idMedico;
    url += '?token=' + this.usuarioService.token;

    return this.http.delete(url)
               .map( (resp) => {
                 swal('Médico borrado', 'El médico ha sido eliminado correctamente', 'success');
                 return true;
               });
  }

  guardarMedico( medico: Medico ) {
    let url = URL_SERVICES + '/medico';

  if (medico._id) {
    // actualizando
    url += '/' + medico._id;
    url += '?token=' + this.usuarioService.token;
    return this.http.put(url, medico)
              .map( (resp: any) => {
                swal('Médico actualizado', medico.nombre, 'success');
                return resp.medico;
              });

  } else {
    // creando
    url += '?token=' + this.usuarioService.token;
    return this.http.post(url, medico)
              .map( (resp: any) => {
                swal('Médico creado', medico.nombre, 'success');
                return resp.medico;
              });
  }

  }

}
