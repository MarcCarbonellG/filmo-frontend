import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: false,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
})
export class AvatarComponent implements OnInit, OnChanges {
  @Input() code!: string;
  @Input() size!: string;
  color!: string;
  width!: string;

  ngOnInit() {
    this.color = this.getColor(this.code);
    this.width = this.getWidth(this.size);
  }

  ngOnChanges(): void {
    this.color = this.getColor(this.code);
    this.width = this.getWidth(this.size);
  }

  getColor(code: string): string {
    const colors = [
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#06b6d4',
      '#3b82f6',
      '#6366f1',
      '#ec4899',
    ];
    return colors[+code % colors.length];
  }

  getWidth(size: string): string {
    switch (size) {
      case 'xs':
        return '15px';
      case 'sm':
        return '20px';
      case 'md':
        return '25px';
      case 'lg':
        return '40px';
      case 'xl':
        return '50px';
      case '2xl':
        return '75px';
      default:
        return '25px';
    }
  }
}
