import { Component, OnInit } from '@angular/core';
import { CommonMethods } from 'src/app/common-methods';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: string = '';
  constructor() { }

  ngOnInit(): void {
    this.user = CommonMethods.getItem('role')
  }

  logout(): void {
    CommonMethods.removeItem('customerId');
    CommonMethods.removeItem('token');
    CommonMethods.removeItem('role');
  }

}
