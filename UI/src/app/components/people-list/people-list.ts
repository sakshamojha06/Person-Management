import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonService } from '../../services/person';
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

  people = signal<Person[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

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
}