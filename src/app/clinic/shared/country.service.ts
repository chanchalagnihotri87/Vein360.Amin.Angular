import { Injectable } from '@angular/core';
import State from './clinic-modal/state.model';
import Country from './country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countries: Country[] = [];
  constructor() {
    this.countries = [new State('US', 'United States')];
  }
  public getCountries() {
    return this.countries;
  }

  public getCountry(code: string) {
    return this.countries.find((x) => x.code == code);
  }
}
