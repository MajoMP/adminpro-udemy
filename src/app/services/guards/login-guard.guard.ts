import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable()
export class LoginGuardGuard implements CanActivate {

constructor(public router: Router,
            public usuarioService: UsuarioService) {

}

  canActivate() {

    if (this.usuarioService.estaLogueado()) {
      return true;
    } else {
      console.log('Bloqueado por el login Guard');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
