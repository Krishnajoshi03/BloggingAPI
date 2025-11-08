import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedCard } from "../feed-card/feed-card";
import { PostService, UiPost, PostResponse } from '../services/post.service';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
  imports: [CommonModule, FeedCard, PaginatorModule, SkeletonModule, ButtonModule, MessageModule]
})
export class HomePage implements OnInit {
  posts: UiPost[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  constructor(private postService: PostService,private authService:AuthService) {}

  ngOnInit() {
    this.postService.currentUserId = this.authService.getUser().id??'';
    this.loadPosts();
  }

  loadPosts(page = 0) {
    this.loading = true;
    this.error = null;
    this.currentPage = page;
    
    this.postService.getAllPosts(page, this.pageSize).subscribe({
      next: (response: PostResponse) => {
        this.posts = response.content || response.items || [];
        this.totalRecords = response.totalElements || this.posts.length;
        this.totalPages = response.totalPages || Math.ceil(this.totalRecords / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load posts. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onPageChange(event: any) {
    this.loadPosts(event.page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  retry() {
    this.loadPosts(this.currentPage);
  }
}
