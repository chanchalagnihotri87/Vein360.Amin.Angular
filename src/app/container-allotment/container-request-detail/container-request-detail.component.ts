import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import { EnumToStringPipe } from '../../shared/pipes/enum-to-string.pipe';
import ContainerType from '../shared/container-type.model';
import DonationContainer from '../shared/donation-container.model';

@Component({
  selector: 'app-container-request-detail',
  imports: [DatePipe, EnumToStringPipe],
  templateUrl: './container-request-detail.component.html',
  styleUrl: './container-request-detail.component.scss',
})
export class ContainerRequestDetailComponent implements OnInit {
  @Input({ required: true }) donationContainer?: DonationContainer;
  @Input({ required: true }) containerTypes: ContainerType[] = [];

  public onClose = output();

  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit();
  }
}
