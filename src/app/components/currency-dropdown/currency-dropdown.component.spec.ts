import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyDropdownComponent } from './currency-dropdown.component';

describe('CurrencyDropdownComponent', () => {
  let component: CurrencyDropdownComponent;
  let fixture: ComponentFixture<CurrencyDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyDropdownComponent]
    });
    fixture = TestBed.createComponent(CurrencyDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
