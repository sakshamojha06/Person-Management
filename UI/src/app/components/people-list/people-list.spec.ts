import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { PeopleList } from './people-list';
import { PersonService } from '../../services/person';

describe('PeopleList', () => {
  let component: PeopleList;
  let fixture: ComponentFixture<PeopleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleList],
      providers: [
        provideRouter([]),
        {
          provide: PersonService,
          useValue: {
            getAll: () => of([
              { id: 1, name: 'Asha', age: 28, photoPath: null }
            ]),
            getPhotoUrl: () => 'assets/default-user.png'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display people returned by the service', () => {
    const renderedText = fixture.nativeElement.textContent;

    expect(renderedText).toContain('Asha');
    expect(renderedText).toContain('28');
    expect(renderedText).not.toContain('Loading people...');
  });
});
