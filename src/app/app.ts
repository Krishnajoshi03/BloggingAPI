import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './app.html',
  standalone: true,
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('Blogging');
}
