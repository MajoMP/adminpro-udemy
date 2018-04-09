import { Component, OnInit } from '@angular/core';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { MedicoService } from '../../services/medico/medico.service';
import { Medico } from '../../models/medico.model';



declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  cargando: boolean = true;

  constructor(public medicoService: MedicoService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarMedicos();

    this.modalUploadService.notificacion.subscribe((resp) => {
      this.cargarMedicos();
    });
  }

  actualizarImagen(id: string) {
    this.modalUploadService.mostrarModal('medicos', id);
  }


  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
             .subscribe( (medicos: any) => {
                this.medicos = medicos;
                this.cargando = false;
             });
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }
    this.cargando = true;
    this.medicoService.buscarMedico(termino)
        .subscribe( (medicos: Medico[]) => {
            this.medicos = medicos;
            this.cargando = false;
        });
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Está seguro',
      text: 'Está a punto de borrar a ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( (borrar) => {
        if (borrar) {
            this.medicoService.borrarMedico(medico._id)
                .subscribe( (borrado: boolean) => {
                  console.log(borrado);
                  this.cargarMedicos();
                });
        }
    });
  }



}
