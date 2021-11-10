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

@NgModule({
  declarations: [],
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
  ],
})
export class StylingModule {}
