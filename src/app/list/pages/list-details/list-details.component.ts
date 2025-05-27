import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { MovieService } from '../../../movie/services/movie.service';
import { User } from '../../../user/models/user.interface';
import { List } from '../../models/list.interface';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-list-details',
  standalone: false,
  templateUrl: './list-details.component.html',
  styleUrl: './list-details.component.css',
})
export class ListDetailsComponent {
  @ViewChild('delListRef')
  delListRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('delSuccessRef') delSuccessRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('delErrorRef') delErrorRef!: ElementRef<HTMLDialogElement>;
  list: List | null = null;
  listId: number | null = null;
  user$!: Observable<User | null>;
  baseImageUrl: string;
  isLoggedIn: boolean = false;
  isSaved: boolean = false;
  isEditing: boolean = false;
  localSaved: number = 0;
  title!: string;
  description!: string;
  newTitle!: string;
  newDescription!: string;
  notFound: boolean = false;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private listService: ListService,
    private router: Router
  ) {
    this.baseImageUrl = this.movieService.getImageBaseUrl();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser();
    this.listId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadList();
    this.loadSaved();
  }

  goToPageList(page: number) {
    this.loadList(page);
  }

  openDelListDialog() {
    this.delListRef.nativeElement.showModal();
  }

  closeDelListDialog() {
    this.delListRef.nativeElement.close();
  }

  openDelSuccessDialog() {
    this.delSuccessRef.nativeElement.showModal();
  }

  closeDelSuccessDialog() {
    this.delSuccessRef.nativeElement.close();
    this.router.navigate(['/']);
  }

  openDelErrorDialog() {
    this.delErrorRef.nativeElement.showModal();
  }

  closeDelErrorDialog() {
    this.delErrorRef.nativeElement.close();
  }

  loadList(page?: number) {
    if (this.listId) {
      this.listService.getListById(this.listId, page ?? undefined).subscribe({
        next: (data) => {
          this.list = data;
          this.localSaved = data.saved;
          this.title = data.title;
          this.description = data.description;
          this.newTitle = data.title;
          this.newDescription = data.description;
        },
        error: (err) => {
          if (err.status === 404) {
            this.notFound = true;
          }
          console.error('Error al cargar lista');
        },
      });
    }
  }

  loadSaved() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.listId) {
        this.listService.getSaved(user.id, this.listId).subscribe({
          next: (response) => {
            if (response) {
              this.isSaved = true;
            }
          },
          error: (err) => {
            console.error('Error al cargar guardados', err);
          },
        });
      }
    });
  }

  saveList() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.listId) {
        this.listService.saveList(user.id, this.listId).subscribe({
          next: () => {
            this.isSaved = true;
            ++this.localSaved;
          },
          error: (err) => {
            console.error('Error al guardar lista', err);
          },
        });
      }
    });
  }

  removeMovie(movieId: number) {
    if (this.listId) {
      this.listService.removeFromList(+this.listId, movieId).subscribe({
        next: () => {
          const removedMovie = this.list?.movies.findIndex(
            (movie) => movie.id === movieId
          );
          if (removedMovie !== undefined && removedMovie !== -1) {
            this.list?.movies.splice(removedMovie, 1);
          }
        },
        error: (err) => {
          console.error('Error al quitar película de lista', err);
        },
      });
    }
  }

  deleteList() {
    if (this.listId) {
      this.listService.deleteList(this.listId).subscribe({
        next: () => {
          this.openDelSuccessDialog();
        },
        error: (err: any) => {
          this.openDelErrorDialog();
        },
      });
    }
  }

  removeFromSave() {
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.listId) {
        this.listService.removeFromSaved(user.id, this.listId).subscribe({
          next: () => {
            this.isSaved = false;
            --this.localSaved;
          },
          error: (err) => {
            console.error('Error al quitar lista de guardados', err);
          },
        });
      }
    });
  }

  openEditForm() {
    this.isEditing = true;
  }

  closeEditForm() {
    this.isEditing = false;
  }

  saveChanges() {
    if (
      this.listId &&
      (this.newTitle !== this.title || this.newDescription !== this.description)
    ) {
      this.listService
        .editList(this.listId, this.newTitle, this.newDescription || '')
        .subscribe({
          next: () => {
            this.title = this.newTitle || this.title;
            this.description = this.newDescription;
            this.newTitle = this.title;
            this.newDescription = this.description;
            this.closeEditForm();
          },
          error: (err) => {
            console.error('Error al editar lista', err);
          },
        });
    }
  }
}
