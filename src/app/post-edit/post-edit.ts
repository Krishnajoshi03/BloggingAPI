import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { PostService, PostDetail, Category } from '../services/post.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post-edit',
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
  templateUrl: './post-edit.html',
  styleUrls: ['./post-edit.css']
})
export class PostEditComponent implements OnInit, OnDestroy {
  post: PostDetail | null = null;
  title = '';
  content = '';
  selectedCategory: Category | null = null;
  categories: Category[] = [];
  imageFile: File | null = null;
  imagePreview: string | null = null;
  imageUploadProgress = 0;
  uploading = false;
  saving = false;
  loading = true;
  error: string | null = null;
  permissionError = false;
  hasUnsavedChanges = false;
  originalPost: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(Number(id));
      this.loadCategories();
    } else {
      this.error = 'Invalid post ID';
      this.loading = false;
    }

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

  loadPost(id: number) {
    this.loading = true;
    this.error = null;
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.originalPost = JSON.parse(JSON.stringify(post));
        this.title = post.title;
        this.content = post.content;
        this.imagePreview = post.imageUrl || null;
        
        // Check if user is the author
        const user = this.authService.getUser();
        const currentUserId = user?.id ?? '';
        
        if (post.authorId && Number(currentUserId) !== post.authorId) {
          this.permissionError = true;
          this.error = 'You do not have permission to edit this post.';
          this.loading = false;
          return;
        }

        // Load category if exists
        if (post.categoryId) {
          // Will be set after categories load
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading post', err);
        if (err.status === 404) {
          this.error = 'Post not found';
        } else if (err.status === 403) {
          this.permissionError = true;
          this.error = 'You do not have permission to edit this post.';
        } else {
          this.error = 'Failed to load post. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.postService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        // Set selected category if post has one
        if (this.post?.categoryId) {
          this.selectedCategory = categories.find(c => c.id === this.post!.categoryId) || null;
        }
      },
      error: (err) => {
        console.error('Error loading categories', err);
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
    if (!this.title.trim() || !this.content.trim() || !this.post) {
      this.error = 'Please fill in title and content';
      return;
    }

    this.saving = true;
    this.error = null;

    try {
      let imageUrl: string | undefined = this.post.imageUrl;

      // Upload new image if selected
      if (this.imageFile) {
        this.uploading = true;
        this.imageUploadProgress = 0;
        
        try {
          const uploadResult = await firstValueFrom(this.postService.uploadImage(this.imageFile,'1'));
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

      // Check for concurrent edits (simple version - in production, use version numbers or timestamps)
      const updateData: any = {
        title: this.title.trim(),
        content: this.content.trim()
      };

      if (this.selectedCategory) {
        updateData.categoryId = this.selectedCategory.id;
      }

      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      this.postService.updatePost(this.post.id, updateData).subscribe({
        next: (res: any) => {
          this.hasUnsavedChanges = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Post updated successfully!'
          });
          this.router.navigate(['/post', this.post!.id]);
        },
        error: (err) => {
          console.error('Error updating post', err);
          if (err.status === 409) {
            this.error = 'This post was modified by someone else. Please refresh and try again.';
          } else {
            this.error = err?.error?.message ?? 'Failed to update post. Please try again.';
          }
          this.saving = false;
        }
      });
    } catch (err) {
      console.error('Unexpected error', err);
      this.error = 'An unexpected error occurred. Please try again.';
      this.saving = false;
    }
  }
}

