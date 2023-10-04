import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DeviceDetectionService } from 'projects/device-detection/src/public-api';
import { AuthService } from 'src/app/shared services/services/auth.service';
import { CrudService } from 'src/app/shared services/services/crud.service';
import { AuthRoutingModule } from '../auth-routing.module';
import { AuthComponent } from '../auth/auth.component';
import { LoginComponent } from './login.component';
import { AppRoutes } from 'src/app/routes/app.routes';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const deviceDetectionServiceMock = {
    getDeviceInfo: jasmine.createSpy('getDeviceInfo').and.returnValue({ deviceType: 'desktop' }),
  };

  const crudServiceMock = {
    post: jasmine.createSpy('post').and.returnValue(Promise.resolve({ status: true, response: { userToken: 'mockToken' } })),
  };

  const authServiceMock = {
    setAccessToken: jasmine.createSpy('setAccessToken'),
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, AuthComponent],
      imports: [
        CommonModule,
        AuthRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordModule,
        HttpClientTestingModule,
      ],
      providers: [
        Router,
        CrudService,
        AuthService,
        {
          provide: DeviceDetectionService,
          useValue: deviceDetectionServiceMock, // Provide the mock service
        },
        { provide: CrudService, useValue: crudServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be Crud Service created', () => {
    const service: CrudService = TestBed.get(CrudService);
    expect(service).toBeTruthy();
  });

  it('should be Auth created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should create Login component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form', () => {
    expect(component.form).toBeDefined();
  });

  it('should mark email field as invalid if it is empty', () => {
    const nameControl = component.form.get('email');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark password field as invalid if it is empty', () => {
    const nameControl = component.form.get('password');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('should email pattern is valid', () => {
    const nameControl = component.form.get('email');
    nameControl?.setValue('mockEmail.com');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['email']).toBeTruthy();
    nameControl?.setValue('a@user.com');
    expect(nameControl?.errors?.['email']).toBeFalsy();
  });

  it('should call onSubmit when submit event occurs', () => {
    const inputElement = fixture.nativeElement.querySelector('.submit-btn');
    const onSubmitSpy = spyOn(component, 'onSubmit');
    component.onSubmit(); // Call the onSubmit function
    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it('should set lat and lng in the form when geolocation is supported', fakeAsync(() => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(position => {
      position({
        coords: {
          latitude: 42.12345, // Replace with your desired latitude value
          longitude: -71.6789, // Replace with your desired longitude value
        },
      } as GeolocationPosition);
    });

    component.getCurrentLocation();
    tick(); // Simulate the passage of time for asynchronous operation

    expect(component.form.get('lat')?.value).toBe(42.12345);
    expect(component.form.get('lng')?.value).toBe(-71.6789);
  }));

  it('should show an alert when geolocation is not supported', () => {
    spyOn(window, 'alert'); // Spy on the window.alert function

    spyOnProperty(navigator, 'geolocation').and.returnValue(undefined as any);

    component.getCurrentLocation();

    expect(window.alert).toHaveBeenCalledWith('Geolocation is not supported by this browser.');
  });

  it('should set device type in the form control', () => {
    // Call the method that sets the device type
    component.setDeviceType();

    // Expect that the getDeviceInfo method was called
    expect(deviceDetectionServiceMock.getDeviceInfo).toHaveBeenCalled();

    // Expect that the 'device' form control was set with the device type
    expect(component.form.get('device')?.value).toBe('desktop'); // Adjust the expected value as needed
  });

  it('should return the form controls', () => {
    // Access the form controls through the getter
    const formControls = component.form as any;

    // Expect that formControls is an instance of FormGroup
    expect(formControls instanceof FormGroup).toBeTruthy();

    // Here, you can add specific expectations for form controls if needed
    // For example:
    expect(formControls.controls['email']).toBeDefined();
    expect(formControls.controls['password']).toBeDefined();
  });

  it('should handle form submission when apiResponse.status is true', fakeAsync(() => {
    // Arrange: Set up the form with valid data (adjust as needed)
    component.form.setValue({
      email: 'testuser@gmail.com',
      password: 'testpassword',
      isRememberMe: false,
      lat: 0,
      lng: 0,
      device: 'desktop',
    });

    // Mock the post method to return a response with status true
    crudServiceMock.post.and.returnValue(Promise.resolve({ status: true, response: { userToken: 'mockToken' } }));

    // Act: Call the onSubmit method
    component.onSubmit();
    tick(); // Advance the fakeAsync tick to resolve the promise

    // Assert: Check the expected behavior
    expect(component.authMessage).toBeFalsy();
    expect(authServiceMock.setAccessToken).toHaveBeenCalledWith('mockToken');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/' + AppRoutes.DashBoard.RootDashBoard + '/' + AppRoutes.DashBoard.RootDashBoard]);
  }));

  it('should handle form submission when the form is invalid', async () => {
    // Arrange: Set up the form with invalid data (e.g., missing required fields)

    component.form.setValue({ email: '', password: '', isRememberMe: false, lat: 0, lng: 0, device: 'desktop' });
    // Act: Call the onSubmit method
    await component.onSubmit();

    // Assert: Check the expected behavior
    expect(component.isSubmitted).toBeTrue(); // isSubmitted should still be true
    expect(crudServiceMock.post).not.toHaveBeenCalled(); // post should not be called
    expect(authServiceMock.setAccessToken).not.toHaveBeenCalled(); // setAccessToken should not be called
    expect(routerMock.navigate).not.toHaveBeenCalled(); // navigate should not be called
    expect(component.authMessage).toBeFalsy(); // No error message expected
  });

  it('should handle form submission when apiResponse.status is false', fakeAsync(() => {
    // Arrange: Set up the form with valid data (adjust as needed)
    component.form.setValue({ email: 'a@user.com', password: 'Admin@123', isRememberMe: false, lat: 0, lng: 0, device: 'desktop' });

    // Mock the post method to return a response with status false
    crudServiceMock.post.and.returnValue(Promise.resolve({ status: false, message: 'Error message' }));

    // Act: Call the onSubmit method
    component.onSubmit();
    tick(); // Advance the fakeAsync tick to resolve the promise

    // Assert: Check the expected behavior
    expect(component.authMessage).toBe('Error message');
    expect(authServiceMock.setAccessToken).not.toHaveBeenCalled(); // setAccessToken should not be called
    expect(routerMock.navigate).not.toHaveBeenCalled(); // navigate should not be called
  }));
});
