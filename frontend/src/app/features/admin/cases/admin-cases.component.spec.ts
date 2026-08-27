
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCasesComponent } from './admin-cases.component';

describe('AdminCasesComponent', () => {
    let component: AdminCasesComponent;
    let fixture: ComponentFixture<AdminCasesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminCasesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminCasesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
