import { Component, inject } from '@angular/core';
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { SearchService } from '../../core/services/ui/search-service';
import { ToolbarMainMenu } from "../toolbar-main-menu/toolbar-main-menu";
import { RouterLink } from "@angular/router";
import { FilterMenu } from "../filter-menu/filter-menu";
import { AuthService } from '../../auth/auth-service';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbar, MatIcon, MatButtonModule, MatMenuModule, ToolbarMainMenu, RouterLink, FilterMenu],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {
  protected searchService = inject(SearchService);
  protected authService = inject(AuthService);
  protected languageService = inject(LanguageService);


}
