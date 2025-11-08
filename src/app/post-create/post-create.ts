import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CanDeactivate } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PostService, Category } from '../services/post.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    MessageModule,
    ProgressBarModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './post-create.html',
  styleUrls: ['./post-create.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  title = '';
  content = '';
  selectedCategory: Category | null = null;
  categories: Category[] = [];
  imageFile: File | null = null;
  imagePreview: string | null = null;
  imageUploadProgress = 0;
  uploading = false;
  saving = false;
  error: string | null = null;
  hasUnsavedChanges = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadCategories();
    
    // Track form changes
    // Note: In a real app, you'd use a form control to track changes more elegantly
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  beforeUnloadHandler = (e: BeforeUnloadEvent) => {
    if (this.hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  canDeactivate(): boolean | Observable<boolean> {
    if (this.hasUnsavedChanges) {
      return new Observable(observer => {
        this.confirmationService.confirm({
          message: 'You have unsaved changes. Are you sure you want to leave?',
          header: 'Unsaved Changes',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          }
        });
      });
    }
    return true;
  }

  loadCategories() {
    this.postService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        // Continue without categories if endpoint doesn't exist
        this.categories = [];
      }
    });
  }

  onImageSelect(event: any) {
    const file = event.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size must be less than 5MB';
        return;
      }
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      this.hasUnsavedChanges = true;
    }
  }

  removeImage() {
    this.imageFile = null;
    this.imagePreview = null;
    this.hasUnsavedChanges = true;
  }

  onCategoryChange(categoryId: number | string) {
    if (categoryId === '' || categoryId === null) {
      this.selectedCategory = null;
    } else {
      const id = typeof categoryId === 'string' ? Number(categoryId) : categoryId;
      this.selectedCategory = this.categories.find(c => c.id === id) || null;
    }
    this.hasUnsavedChanges = true;
  }

  onFieldChange() {
    this.hasUnsavedChanges = true;
  }

  async onSubmit() {
    if (!this.title.trim() || !this.content.trim()) {
      this.error = 'Please fill in title and content';
      return;
    }

    this.saving = true;
    this.error = null;
    let postId ='';

    try {
        // Create post
    const postData: any = {
      title: this.title.trim(),
      content: this.content.trim()
    };
      this.postService.createPost(postData,'1').subscribe({
        next: (res: any) => {
           postId = res?.postId ?? res?.id ?? res?.data?.id;
          this.hasUnsavedChanges = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Post created successfully!'
          });
          this.router.navigate(['/post', postId]);
        },
        error: (err) => {
          console.error('Error creating post', err);
          this.error = err?.error?.title + err?.error?.content;
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: err?.error?.message });
        }
      });
    } catch (err) {
      console.error('Unexpected error', err);
      this.error = 'An unexpected error occurred. Please try again.';
      this.saving = false;
    }
    let imageUrl: string | undefined;

    // Upload image first if selected
    if (this.imageFile) {
      this.uploading = true;
      this.imageUploadProgress = 0;
      
      try {
        const uploadResult = await firstValueFrom(this.postService.uploadImage(this.imageFile,postId));
        imageUrl = uploadResult?.url;
        this.imageUploadProgress = 100;
      } catch (err) {
        console.error('Image upload error', err);
        this.error = 'Failed to upload image. Please try again.';
        this.uploading = false;
        this.saving = false;
        return;
      }
      
      this.uploading = false;
    }
  }
}

