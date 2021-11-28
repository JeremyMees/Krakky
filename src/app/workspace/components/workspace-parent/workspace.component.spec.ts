import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/user/services/user.service';
import { WorkspaceService } from '../../services/workspace.service';
import { routes } from '../../../app-routing.module';
import { WorkspaceComponent } from './workspace.component';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { User } from 'src/app/user/models/user.model';
import { HttpResponse } from 'src/app/shared/models/http-response.model';
import { HttpResponseFailed } from 'src/app/shared/data/mock/http-response-failed';
import { HttpResponseSucces } from 'src/app/shared/data/mock/http-response-succes';
import { AggregatedWorkspaceMock } from 'src/app/shared/data/mock/aggregatedWorkspace';
import { AggregatedWorkspace } from '../../models/aggregated-workspace.model';

fdescribe('WorkspaceComponent', () => {
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let workspaceService: jasmine.SpyObj<WorkspaceService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let route: jasmine.SpyObj<ActivatedRoute>;
  let user: User = { email: 'user@example.com', _id: 'foo id' };
  let httpResponseSucces: HttpResponse = HttpResponseSucces;
  httpResponseSucces.data = [AggregatedWorkspaceMock as AggregatedWorkspace];
  let httpResponseFailed: HttpResponse = HttpResponseFailed;
  const params$ = new Subject<{ id?: string }>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkspaceComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        {
          provide: UserService,
          useValue: jasmine.createSpyObj('UserService', ['getCurrentUser']),
        },
        {
          provide: WorkspaceService,
          useValue: jasmine.createSpyObj('WorkspaceService', [
            'getAggregatedWorkspace',
            'getAggregatedWorkspaces',
          ]),
        },
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj('MessageService', ['add']),
        },
        {
          provide: ActivatedRoute,
          useValue: { params: params$ },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    workspaceService = TestBed.inject(
      WorkspaceService
    ) as jasmine.SpyObj<WorkspaceService>;
    messageService = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    component = fixture.componentInstance;
    component.current_user = user;
    userService.getCurrentUser.and.returnValue(
      new BehaviorSubject(user) as BehaviorSubject<User | null>
    );
    params$.next({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    // it('should init without params', () => {
    //   spyOn(component, 'getAggregatedWorkspaces');
    //   component.ngOnInit();
    //   expect(component.getAggregatedWorkspaces).toHaveBeenCalledWith('foo id');
    // });

    it('should init with params', () => {
      fixture.detectChanges();
      params$.next({ id: '12345' });
      fixture.detectChanges();
      spyOn(component, 'getWorkspace');
      component.ngOnInit();
      expect(component.workspace_id).toEqual('12345');
      // expect(component.getWorkspace).toHaveBeenCalledWith('12345');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscibe to subscriptions', () => {
      spyOn(component.current_user_sub$, 'unsubscribe');
      spyOn(component.destroy$, 'next');
      component.ngOnDestroy();
      expect(component.current_user_sub$.unsubscribe).toHaveBeenCalled();
      expect(component.destroy$.next).toHaveBeenCalledWith(true);
    });
  });

  describe('workspaceService', () => {
    it('should get workspace succesfull', () => {
      workspaceService.getAggregatedWorkspace.and.returnValue(
        of(httpResponseSucces)
      );
      component.getWorkspace('id');
      expect(component.isLoading).toBeFalsy();
      expect(workspaceService.getAggregatedWorkspace).toHaveBeenCalledWith(
        'id'
      );
      expect(component.selected_workspace).toEqual(httpResponseSucces.data[0]);
    });

    // it('should get workspace failed', () => {
    // httpResponseFailed.statusCode = 400;
    // workspaceService.getAggregatedWorkspace.and.returnValue(
    //   of(httpResponseFailed)
    // );
    // component.getWorkspace('id');
    // expect(component.isLoading).toBeFalsy();
    // expect(component._showSnackbar).toHaveBeenCalledWith({
    //   severity: 'error',
    //   detail: httpResponseFailed.message,
    // });
    // });

    it('should get multiple workspaces', () => {
      workspaceService.getAggregatedWorkspaces.and.returnValue(
        of(httpResponseSucces)
      );
      component.getAggregatedWorkspaces('id');
      expect(component.isLoading).toBeFalsy();
      expect(workspaceService.getAggregatedWorkspaces).toHaveBeenCalledWith(
        'id'
      );
      expect(component.workspaces).toEqual(httpResponseSucces.data);
    });
  });
});
