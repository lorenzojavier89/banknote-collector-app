import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banknote } from '../models/banknote.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private jsonUrl = 'assets/data/catalog.json';

  constructor(private http: HttpClient) { }
  
  getBanknotes(): Observable<Banknote[]> {
    return this.http.get<Banknote[]>(this.jsonUrl);
  }
}
