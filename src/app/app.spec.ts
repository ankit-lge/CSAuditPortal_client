import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { RouteLoader } from './core/loader/route-loader/route-loader';
import { NavBar } from './pages/nav-bar/nav-bar';
import { Header } from './pages/header/header';
import { AlertModal } from './pages/alert-modal/alert-modal';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        RouteLoader
      ],
      declarations: [
        App,
        NavBar,
        Header,
        AlertModal,
        RouteLoader
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
