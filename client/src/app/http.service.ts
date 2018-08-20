import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private _http: HttpClient) {}
  getSessions() {
    return this._http.get('/sessions');
  }
  getSingleSession(id) {
    return this._http.get(`/sessions/${id}`);
  }
  addSession(new_session) {
    return this._http.post('/sessions', new_session);
  }
  editSession(id, updated_session) {
    return this._http.put(`/sessions/${id}`, updated_session);
  }
  deleteSession(id) {
    return this._http.delete(`/sessions/${id}`);
  }
  // addUser(id, new_user) {
  //   return this._http.post(`/users/${id}`, new_user);
  // }
}
