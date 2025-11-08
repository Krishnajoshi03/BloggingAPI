import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { PostService, PostDetail, Comment } from '../services/post.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    SkeletonModule,
    MessageModule,
  ],
  templateUrl: './post-detail.html',
  styleUrls: ['./post-detail.css']
})
export class PostDetailComponent implements OnInit {
  post: PostDetail | null = null;
  comments: Comment[] = [];
  loading = true;
  commentsLoading = false;
  error: string | null = null;
  commentContent = '';
  isAuthenticated = false;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkAuth();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(Number(id));
      this.loadComments(Number(id));
    } else {
      this.error = 'Invalid post ID';
      this.loading = false;
    }
  }

  checkAuth() {
    this.isAuthenticated = !!this.authService.token;
    const user = this.authService.getUser();
    this.currentUserId = Number(user?.id ?? '');
  }

  loadPost(id: number) {
    this.loading = true;
    this.error = null;
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
        this.comments = post.comments??[];
      },
      error: (err) => {
        console.error('Error loading post', err);
        if (err.status === 404) {
          this.error = 'Post not found';
        } else {
          this.error = 'Failed to load post. Please try again.';
        }
        this.loading = false;
      }
    });
  }

  loadComments(postId: number) {
    this.commentsLoading = true;
    this.postService.getComments(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.commentsLoading = false;
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.commentsLoading = false;
        // Don't show error for comments, just log it
      }
    });
  }

  submitComment() {
    if (!this.commentContent.trim() || !this.post) return;


    // Optimistic UI update
    const previousContent = this.commentContent;
    this.commentContent = '';

    this.postService.createComment(this.post.id, previousContent).subscribe({
      next: (comment) => {
        // Replace optimistic comment with real one
        comment.authorName = this.authService.getUser().email??'Unknown';
        comment.postId = Number(this.post?.id);
        this.comments = [...this.comments, comment];
        if (this.post) {
          this.post.commentsCount = this.comments.length;
        }
      },
      error: (err) => {
        console.error('Error creating comment', err);
        // Revert optimistic update
        this.commentContent = previousContent;
        alert('Failed to post comment. Please try again.');
      }
    });
  }

  canDeleteComment(comment: Comment): boolean {
    return this.isAuthenticated && (this.currentUserId === comment.authorId);
  }

  deleteComment(comment: Comment) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const commentId = comment.cmt_id;
    this.comments = this.comments.filter(c => c.cmt_id !== commentId);

    this.postService.deleteComment(commentId).subscribe({
      error: (err) => {
        console.error('Error deleting comment', err);
        // Revert on error
        this.comments = [...this.comments, comment];
        alert('Failed to delete comment. Please try again.');
      }
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}

