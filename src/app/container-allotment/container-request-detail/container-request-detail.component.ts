import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import ContainerType from '../../container/shared/container-type.model';
import { ContainerService } from '../../container/shared/container.service';
import DonationContainer from '../../container/shared/donation-container.model';
import Vein360Container from '../../container/shared/vein-360-container.model';
import { EnumToStringPipe } from '../../shared/pipes/enum-to-string.pipe';

@Component({
  selector: 'app-container-request-detail',
  imports: [DatePipe, EnumToStringPipe],
  templateUrl: './container-request-detail.component.html',
  styleUrl: './container-request-detail.component.scss',
})
export class ContainerRequestDetailComponent implements OnInit {
  @Input({ required: true }) donationContainer?: DonationContainer;
  @Input({ required: true }) containerTypes: ContainerType[] = [];

  onClose = output();

  containers: Vein360Container[] = [];

  constructor(private containerService: ContainerService) {}

  ngOnInit(): void {
    this.loadContainers();
  }

  closeModal() {
    this.onClose.emit();
  }

  //#region Private Methods

  loadContainers() {
    this.containerService.getContainers().subscribe((containers) => {
      this.containers = containers;
    });
  }

  // #endregion
}
