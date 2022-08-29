import { Component, OnInit } from '@angular/core';
import { createAnimation } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  tablero = [];
  iconosTablero = [];
  turno;
  icono;

  constructor() {
    this.restartTablero();
  }

  ngOnInit() {
  }

  async seleccionarCasilla(fila, columna, e) {
    if (this.tablero[fila][columna] == 0) {
      // Obtengo el elemento del icono
      let elementoCasilla = e.path.filter(x => x.classList != undefined && x.classList.contains('col-item'))[0].firstChild;
      // Animacion de desaparicion
      await this.animacion(elementoCasilla, 1);
      // Cambio el icono y relleno los iconos del tablero
      this.tablero[fila][columna] = this.turno;
      this.iconosTablero[fila][columna] = this.icono;
      // Animacion de aparicion
      await this.animacion(elementoCasilla, 2);
      if (!this.checkTablero()) {
        if (this.turno == 1) {
          this.turno = 2;
          this.icono = 'close-outline';
        } else {
          this.turno = 1;
          this.icono = 'ellipse-outline';
        }
        let contador = 0;
        this.tablero.forEach(fila => {
          if (fila[0] == 0 || fila[1] == 0 || fila[2] == 0) {
            contador++;
          }
        })
        if (contador < 1) {
          const alert = document.createElement('ion-alert');
          alert.mode = "ios";
          alert.header = '🙀';
          alert.subHeader = 'Juego acabado';
          alert.message = 'El juego acabó sin ganadores';
          alert.buttons = ['OK'];
          document.body.appendChild(alert);
          alert.present();
          this.restartTablero();
        }
      } else {
        createAnimation()
          .addElement(document.getElementsByClassName('victoria')[0])
          .duration(500)
          .iterations(1)
          .fromTo('opacity', '0', '1').play();
        const alert = document.createElement('ion-alert');
        document.body.appendChild(alert);
        alert.mode = "ios";
        alert.header = '😼';
        alert.subHeader = 'Juego acabado';
        alert.message = '🎉 ¡El jugador ' + this.turno + ' ha ganado! 🎉';
        alert.buttons = ['OK'];
        alert.onDidDismiss().then(() => {
          this.restartTablero();
          createAnimation()
            .addElement(document.getElementsByClassName('victoria')[0])
            .duration(100)
            .iterations(1)
            .fromTo('opacity', '1', '0').play();
        });
        alert.present();
      }
    }
  }
  
  checkTablero() {
    for (let x = 0; x < 3; x++) {
      if ((this.tablero[x][0] == this.tablero[x][1] && this.tablero[x][1] == this.tablero[x][2]) && this.tablero[x][0] != 0) {
        return true;
      }
    }
    for (let x = 0; x < 3; x++) {
      if ((this.tablero[0][x] == this.tablero[1][x] && this.tablero[1][x] == this.tablero[2][x]) && this.tablero[0][x] != 0) {
        return true;
      }
    }
    if ((this.tablero[0][0] == this.tablero[1][1] && this.tablero[1][1] == this.tablero[2][2]) && this.tablero[1][1] != 0) {
      return true;
    }
    if ((this.tablero[0][2] == this.tablero[1][1] && this.tablero[1][1] == this.tablero[2][0]) && this.tablero[1][1] != 0) {
      return true;
    }
    return false;
  }

  restartTablero() {
    this.tablero = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.iconosTablero = [['medical', 'medical', 'medical'], ['medical', 'medical', 'medical'], ['medical', 'medical', 'medical']];
    this.turno = 1;
    this.icono = 'ellipse-outline';
  }

  async animacion(e, t) {
    if (t == 1) {
      const anim = createAnimation()
        .addElement(e)
        .duration(200)
        .iterations(1)
        .fromTo('opacity', '1', '0');
      await anim.play();
    } else {
      const anim = createAnimation()
        .addElement(e)
        .duration(200)
        .iterations(1)
        .fromTo('opacity', '0', '1');
      await anim.play();
    }
  }

}
