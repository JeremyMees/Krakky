import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { MatCardModule } from '@angular/material/card';
import { CarouselModule } from 'primeng/carousel';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingComponent } from './components/loading/loading.component';
import { MatIconModule } from '@angular/material/icon';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { RippleModule } from 'primeng/ripple';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FocusTrapModule } from 'primeng/focustrap';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [LoadingComponent],
  imports: [ProgressSpinnerModule, BrowserAnimationsModule],
  exports: [
    BrowserAnimationsModule,
    InputSwitchModule,
    ButtonModule,
    MenubarModule,
    MenuModule,
    MatDialogModule,
    AvatarModule,
    AvatarGroupModule,
    PasswordModule,
    InputTextModule,
    MatCardModule,
    ImageModule,
    CarouselModule,
    TooltipModule,
    ToastModule,
    ProgressSpinnerModule,
    LoadingComponent,
    MatIconModule,
    BadgeModule,
    OverlayPanelModule,
    TableModule,
    DropdownModule,
    ConfirmPopupModule,
    RippleModule,
    DragDropModule,
    InputTextareaModule,
    FocusTrapModule,
    CalendarModule,
    ChartModule,
    CheckboxModule,
    ColorPickerModule,
    AccordionModule,
  ],
})
export class StylingModule {}
