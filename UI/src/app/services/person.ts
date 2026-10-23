import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5124/api/Person';

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

  getById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  update(id: number, person: Person): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, person);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadPhoto(photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);

    return this.http.post(
      `${this.apiUrl}/upload-photo`,
      formData
    );
  }

  getPhotoUrl(photoPath: string | null): string {
    if (!photoPath) {
      return 'assets/default-user.png';
    }
    
    return `http://localhost:5124${photoPath}`;
  }
}