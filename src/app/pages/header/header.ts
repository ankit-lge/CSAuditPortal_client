import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @Output() toggle = new EventEmitter<boolean>();
  isSidebarCollapsed = false;
  toggleSideBar(){
     this.isSidebarCollapsed = !this.isSidebarCollapsed;

  this.toggle.emit(this.isSidebarCollapsed);
  }
}
