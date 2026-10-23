import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { PeopleList } from './people-list';
import { PersonService } from '../../services/person';
import { NotificationService } from '../../services/notification';

describe('PeopleList', () => {
  let component: PeopleList;
  let fixture: ComponentFixture<PeopleList>;
  let personService: {
    getAll: ReturnType<typeof vi.fn>;
    getPhotoUrl: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let notificationService: { show: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    personService = {
      getAll: vi.fn().mockReturnValue(of([
        { id: 1, name: 'Asha', age: 28, photoPath: null }
      ])),
      getPhotoUrl: vi.fn().mockReturnValue('assets/default-user.png'),
      delete: vi.fn().mockReturnValue(of('Person deleted successfully'))
    };
    notificationService = { show: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [PeopleList],
      providers: [
        provideRouter([]),
        { provide: PersonService, useValue: personService },
        { provide: NotificationService, useValue: notificationService }
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

  it('should show a confirmation dialog before deleting', () => {
    component.deletePerson(1);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Are you sure you want to delete this person?');
    expect(personService.delete).not.toHaveBeenCalled();
    expect(notificationService.show).not.toHaveBeenCalled();
  });

  it('should delete and show success after confirming in the dialog', () => {
    component.deletePerson(1);
    fixture.detectChanges();

    const confirmButton: HTMLButtonElement = fixture.nativeElement.querySelector('.modal-footer .btn-danger');
    confirmButton.click();

    expect(personService.delete).toHaveBeenCalledWith(1);
    expect(notificationService.show).toHaveBeenCalledWith('Person deleted successfully.', 'success');
  });

  it('should not delete when the confirmation dialog is cancelled', () => {
    component.deletePerson(1);
    fixture.detectChanges();

    const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('.modal-footer .btn-outline-secondary');
    cancelButton.click();

    expect(component.pendingDeleteId()).toBeNull();
    expect(personService.delete).not.toHaveBeenCalled();
    expect(notificationService.show).not.toHaveBeenCalled();
  });
});
