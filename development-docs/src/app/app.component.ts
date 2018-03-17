import { Component, Inject } from '@angular/core';
import { ResponsiveProvider } from './core/responsive.provider';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  cols = 2;
  constructor(
    @Inject(DOCUMENT) private document: any,
    public responsive: ResponsiveProvider
  ) {
    this.responsive.width$.subscribe((width) => {
      if (width < 600) {
        this.cols = 1;
      } else {
        this.cols = 2;
      }
    });
  }

  goToUrl(url: string): void {
    this.document.location.href = url;
  }
}
