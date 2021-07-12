import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService { 
  constructor(private http: HttpClient) { 
  }

  get(data){
    return this.http.post(environment.apiBaseUrl+"getApiEndpoint",data);
  }
  post(data){
    return this.http.post(environment.apiBaseUrl+"postApiEndpoint",data);
  }
  


}
