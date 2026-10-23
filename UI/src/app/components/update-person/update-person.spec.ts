import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePerson } from './update-person';

describe('UpdatePerson', () => {
  let component: UpdatePerson;
  let fixture: ComponentFixture<UpdatePerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePerson],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePerson);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
