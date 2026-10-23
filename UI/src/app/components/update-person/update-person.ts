
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PersonService } from '../../services/person';
import { NotificationService } from '../../services/notification';
import { Person } from '../../models/person';

@Component({
  selector: 'app-update-person',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './update-person.html',
  styleUrl: './update-person.css'
})
export class UpdatePerson implements OnInit {

  private personService = inject(PersonService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  personId!: number;

  name = signal('');
  age = signal<number | null>(null);
  photoPath = signal<string | null>(null);
  selectedPhoto = signal<File | null>(null);

  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.personId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPerson();
  }

  loadPerson(): void {
    this.personService.getById(this.personId).subscribe({
      next: (person) => {
        this.name.set(person.name);
        this.age.set(person.age);
        this.photoPath.set(person.photoPath);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Unable to load person details.');
        this.isLoading.set(false);
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedPhoto.set(input.files?.[0] ?? null);
  }

  saveChanges(): void {
    if (!this.name().trim() || this.age() === null || this.age()! <= 0) {
      this.errorMessage.set('Please enter a valid name and age.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    if (this.selectedPhoto()) {
      this.personService.uploadPhoto(this.selectedPhoto()!).subscribe({
        next: (response) => {
          this.updatePerson(response.photoPath);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage.set('Photo upload failed.');
          this.isSaving.set(false);
        }
      });
    } else {
      this.updatePerson(this.photoPath());
    }
  }

  private updatePerson(photoPath: string | null): void {
    const person: Person = {
      id: this.personId,
      name: this.name().trim(),
      age: this.age()!,
      photoPath: photoPath
    };

    this.personService.update(this.personId, person).subscribe({
      next: () => {
        this.notificationService.show('Person updated successfully.', 'success');
        this.router.navigate(['/people']);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Unable to update person.');
        this.isSaving.set(false);
      }
    });
  }

  getPhotoUrl(): string {
    return this.personService.getPhotoUrl(this.photoPath());
  }
}
