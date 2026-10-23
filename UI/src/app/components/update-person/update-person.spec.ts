import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UpdatePerson } from './update-person';
import { PersonService } from '../../services/person';

describe('UpdatePerson', () => {
  let component: UpdatePerson;
  let fixture: ComponentFixture<UpdatePerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePerson],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        {
          provide: PersonService,
          useValue: {
            getById: () => of({
              id: 1,
              name: 'Asha',
              age: 28,
              photoPath: null
            }),
            getPhotoUrl: () => 'assets/default-user.png'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePerson);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the loaded person details', () => {
    const renderedText = fixture.nativeElement.textContent;
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[name="name"]'
    );
    const ageInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[name="age"]'
    );

    expect(renderedText).toContain('Personal Details');
    expect(renderedText).not.toContain('Loading person details...');
    expect(nameInput.value).toBe('Asha');
    expect(ageInput.value).toBe('28');
  });
});
