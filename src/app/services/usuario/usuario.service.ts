import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

import swal from 'sweetalert';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Jsonp } from '@angular/http';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';



@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(public http: HttpClient,
              public router: Router,
              public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }


  renuevaToken() {
    let url = URL_SERVICES + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get(url)
               .map((resp: any) => {
                 this.token = resp.token;
                 localStorage.setItem('token', this.token);
                 return true;
               })
               .catch( (err) => {
                 this.router.navigate(['/login']);
                  swal('No se puedo renovar token', 'No fue posible renovar el token', 'error');
                  return Observable.throw(err);
             });
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }


  guardarStorage(id: string, token: string, usuario: Usuario, menu: any ) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('menu', JSON.stringify(menu));

      this.usuario = usuario;
      this.token = token;
      this.menu = menu;
  }


  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }


  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }


  loginGoogle(token: string) {
    let url = URL_SERVICES + '/login/google';

    return this.http.post(url, {token: token})
            .map((resp: any) => {
              this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
              return true;
            });
  }

  login(usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICES + '/login';
    return this.http.post(url, usuario)
               .map((resp: any) => {
                  this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
                  return true;
               })
               .catch( (err) => {
                  swal('Error en el login', err.error.mensaje, 'error');
                  return Observable.throw(err);
               });
  }


  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICES + '/usuario';
    return this.http.post(url, usuario)
              .map( (resp: any) => {
                swal('Usuario creado', usuario.email, 'success');
                return resp.usuario;
              })
              .catch( (err) => {
                swal(err.error.mensaje, err.error.errors.message, 'error');
                return Observable.throw(err);
             });
  }


  actualizarUsuario (usuario: Usuario) {
    let url = URL_SERVICES + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario)
               .map( (resp: any) => {
                 if (usuario._id === this.usuario._id) {
                  let usuarioDB: Usuario = resp.usuario;
                  this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
                 }
                 swal('Usuario actualizado', usuario.nombre, 'success');
                  return true;
               })
               .catch( (err) => {
                swal(err.error.mensaje, err.error.errors.message, 'error');
                return Observable.throw(err);
             });
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id )
         .then( (resp: any) => {
            this.usuario.img = resp.usuario.img;
            swal('Imagen actualizada', this.usuario.nombre, 'success');
            this.guardarStorage(id, this.token, this.usuario, this.menu);
         })
         .catch((resp) => {
          console.log(resp);
         } );
  }

  cargarUsuarios( desde: number = 0) {
    let url = URL_SERVICES + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    let url = URL_SERVICES + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
               .map( (resp: any) => {
                 return resp.usuarios;
               });
  }

  borrarUsuario( idUsuario: string) {
    let url = URL_SERVICES + '/usuario/' + idUsuario + '?token=' + this.token;
    return this.http.delete(url)
               .map( (resp) => {
                 swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
                 return true;
               });
  }

}
