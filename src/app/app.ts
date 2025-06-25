import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Master } from './components/master/master';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Master],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'angular_1st_app';
}
