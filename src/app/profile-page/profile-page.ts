import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PostService, UiPost } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { FeedCard } from '../feed-card/feed-card';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, ConfirmDialogModule, FeedCard],
  providers: [ConfirmationService, MessageService],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePageComponent implements OnInit {
  user: any = null;
  posts: UiPost[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (!this.authService.token) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = this.authService.getUser();
    this.postService.currentUserId = this.user.id;
    this.loadUserPosts();
  }

  loadUserPosts() {
    this.loading = true;
    this.error = null;

    // Note: This assumes the API supports filtering by author
    // If not, you'd need to fetch all posts and filter client-side
    const userId = this.user.id ?? '';
    
    this.postService.getPostsOfCurrentUser().subscribe({
      next: (response) => {
        // Filter posts by current user
        const allPosts = response.content || response.items || [];
        this.posts = allPosts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user posts', err);
        this.error = 'Failed to load your posts. Please try again.';
        this.loading = false;
      }
    });
  }

  editPost(postId: string) {
    this.router.navigate(['/edit', postId]);
  }

  deletePost(post: UiPost) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
      header: 'Delete Post',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.postService.deletePost(post.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Post deleted successfully!'
            });
            this.loadUserPosts();
          },
          error: (err) => {
            console.error('Error deleting post', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete post. Please try again.'
            });
          }
        });
      }
    });
  }

  getUserInitials(): string {
    if (!this.user) return 'U';
    const name = this.user.email;
    return name.charAt(0).toUpperCase() || 'U';
  }
}

