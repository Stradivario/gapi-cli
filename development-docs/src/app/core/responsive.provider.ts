import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/distinctUntilChanged';


const getWindowSize = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
};

const createWindowSize$ = () =>
  Observable.fromEvent(window, 'resize')
    .map(getWindowSize)
    .startWith(getWindowSize())
    .publishReplay(1)
    .refCount();


@Injectable()
export class ResponsiveProvider {
  cols = 2;
  cols_second = 3;
  width = 400;
  height = 570;
  width$: Observable<number>;
  height$:  Observable<number>;
  constructor() {
    const windowSize$ = createWindowSize$();
    this.width$ = (windowSize$.pluck('width') as Observable<number>).distinctUntilChanged();
    this.height$ = (windowSize$.pluck('height') as Observable<number>).distinctUntilChanged();
    this.width$.subscribe(width => this.width = width);
    this.height$.subscribe(height => this.height = height);
    this.width$
      .switchMap(res => this.getWindowSize(res))
      .subscribe((res: any) => {
        this.onResize({
          target: {
            innerWidth: res.width,
          }
        });
      });
  }
  getWindowSize(width) {
    return Observable.create(observer => {
      this.height$.subscribe(height => {
        observer.next({
          height: height,
          width: width
        });
      });
    });
  }
  onResize(event) {
    if (event.target.innerWidth < 450) {
      this.cols = 1;
      this.cols_second = 1;
    }
    if (event.target.innerWidth < 900) {
      this.cols = 1;
      this.cols_second = 1;
    }

    if (event.target.innerWidth > 900) {
      this.cols = 2;
      this.cols_second = 3;
    }

    if (event.target.innerWidth > 1400) {
      this.cols = 2;
      this.cols_second = 3;
    }

    if (event.target.innerWidth < 750) {
      this.cols = 1;
      this.cols_second = 1;
    }

  }
}
