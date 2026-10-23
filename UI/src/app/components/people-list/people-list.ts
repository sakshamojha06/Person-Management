import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonService } from '../../services/person';
import { NotificationService } from '../../services/notification';
import { Person } from '../../models/person';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './people-list.html',
  styleUrl: './people-list.css'
})
export class PeopleList implements OnInit {
  private personService = inject(PersonService);
  private notificationService = inject(NotificationService);

  people = signal<Person[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  pendingDeleteId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.personService.getAll().subscribe({
      next: (data) => {
        this.people.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching people:', error);
        this.errorMessage.set('Unable to load people. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  getPhotoUrl(photoPath: string | null): string {
    return this.personService.getPhotoUrl(photoPath);
  }

  deletePerson(id: number): void {
    this.pendingDeleteId.set(id);
  }

  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id === null) {
      return;
    }

    this.personService.delete(id).subscribe({
      next: () => {
        this.pendingDeleteId.set(null);
        this.notificationService.show('Person deleted successfully.', 'success');
        this.loadPeople();
      },
      error: (error) => {
        console.error('Error deleting person:', error);
        this.pendingDeleteId.set(null);
        this.errorMessage.set('Unable to delete person. Please try again.');
      }
    });
  }
}