import { Component, Input, OnInit, output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Vein360ContainerStatus } from '../../shared/enums/vein360-container-status';
import ContainerType from '../shared/container-type.model';
import Vein360Container from '../shared/vein-360-container.model';

@Component({
  selector: 'app-container-detail',
  imports: [],
  templateUrl: './container-detail.component.html',
  styleUrl: './container-detail.component.scss',
})
export class ContainerDetailComponent implements OnInit {
  @Input({ required: true }) containerTypes: ContainerType[] = [];
  @Input({ required: true }) container?: Vein360Container;

  public onClose = output();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  //#region  Public Methods

  public closeModal() {
    this.onClose.emit();
  }

  //#endregion

  //#region Get Properties

  get ContainerType() {
    return ContainerType;
  }

  get Vein360ContainerStatus() {
    return Vein360ContainerStatus;
  }

  //#endregion
}
