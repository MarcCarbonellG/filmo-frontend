import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  standalone: false,
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent {
  @Input() class = '';
  @Input() searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();

  onInputChange(value: string) {
    this.searchTermChange.emit(value);
  }

  triggerSearch() {
    this.search.emit();
  }
}
