import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  cargando: boolean = true;

  constructor(public hospitalService: HospitalService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();

    this.modalUploadService.notificacion.subscribe((resp) => {
      this.cargarHospitales();
    });
  }

  actualizarImagen(id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
             .subscribe( (hospitales: any) => {
                this.hospitales = hospitales;
                this.cargando = false;
             });
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }
    this.cargando = true;
    this.hospitalService.buscarHospital(termino)
        .subscribe( (hospitales: Hospital[]) => {
            this.hospitales = hospitales;
            this.cargando = false;
        });
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Está seguro',
      text: 'Está a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( (borrar) => {
        if (borrar) {
            this.hospitalService.borrarHospital(hospital._id)
                .subscribe( (borrado: boolean) => {
                  console.log(borrado);
                  this.cargarHospitales();
                });
        }
    });
  }

  guardarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital)
        .subscribe();
  }

  crearHospital() {
    swal({
      title: 'Crear Hospital',
      text: 'Introduzca el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then( (valor: string) => {
      if (!valor || valor.length === 0) {
        return;
      }
      this.hospitalService.crearHospital(valor)
           .subscribe((resp) => {
             this.cargarHospitales();
           });
    });
  }

}
