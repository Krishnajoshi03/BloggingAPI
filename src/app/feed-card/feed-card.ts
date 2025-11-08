import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiPost } from '../services/post.service';

@Component({
  selector: 'app-feed-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feed-card.html',
  styleUrls: ['./feed-card.css']
})
export class FeedCard {
  @Input() post!: UiPost;
}
