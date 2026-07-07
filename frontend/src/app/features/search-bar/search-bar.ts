import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/ui/search-service';
import { QuizStore } from '../../core/stores/quiz-store';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/services/ui/language-service';

@Component({
  selector: 'app-search-bar',
  imports: [MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {

  protected searchService = inject(SearchService);
  protected languageService = inject(LanguageService);
  
  private quizStore = inject(QuizStore);
  private router = inject(Router);

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.updateQuery(value);
  }

  close() {
    this.searchService.clear()
    this.searchService.setSearching(false);
  }

  search() {
    const query = this.searchService.query().trim();
    if (query !== '') {
      this.quizStore.searchQuizzes(1, 8, query);
      this.router.navigate(['/quizzes']);
    }
  }

}
