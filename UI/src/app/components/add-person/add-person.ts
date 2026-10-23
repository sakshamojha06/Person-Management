import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PersonService } from '../../services/person';
import { NotificationService } from '../../services/notification';
import { Person } from '../../models/person';

@Component({
  selector: 'app-add-person',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-person.html',
  styleUrl: './add-person.css'
})
export class AddPerson {
  private personService = inject(PersonService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  name = '';
  age: number | null = null;
  selectedPhoto: File | null = null;

  isSaving = false;
  errorMessage = '';

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedPhoto = input.files?.[0] ?? null;
  }

  savePerson(): void {
    if (!this.name.trim() || this.age === null || this.age <= 0) {
      this.errorMessage = 'Please enter a valid name and age.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    if (this.selectedPhoto) {
      this.personService.uploadPhoto(this.selectedPhoto).subscribe({
        next: (response) => {
          this.createPerson(response.photoPath);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Photo upload failed.';
          this.isSaving = false;
        }
      });
    } else {
      this.createPerson(null);
    }
  }

  private createPerson(photoPath: string | null): void {

    const person: Person = {
      id: 0,
      name: this.name.trim(),
      age: this.age!,
      photoPath: photoPath
    };

    this.personService.create(person).subscribe({
      next: () => {
        this.notificationService.show('Person added successfully.', 'success');
        this.router.navigate(['/people']);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to save person.';
        this.isSaving = false;
      }
    });
  }
}