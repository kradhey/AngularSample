import { Component, ViewChild, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { QuickSearchItem } from './QuickSearchItem';
import { QuickSearchService } from './quick-search.service';
import { ProjectSearchItem } from '../../components/project-search/ProjectSearchItem';


import { environment } from 'environments/environment';
import { ISubscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { debug } from 'util';


@Component({
  selector: 'ij-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./styles.less']
})
export class ProjectSelectorComponent implements OnInit, OnDestroy {
  public suggestions: ProjectSearchItem[] = [];
  public selected: string[] = [];
  public textVal: any;
  private sub: ISubscription;
  private qs$ = new Subject<string>();

  private pd$ = new Subject<any>();

  @ViewChild("autocomplete") autocomplete;
  @Output() componentHasValue: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private router: Router,
    private quickSvc: QuickSearchService
  ) { }

  ngOnInit() {

    //this.sub = this.qs$
    //  .debounceTime(300)
    //  .switchMap(query => this.quickSvc.getQuickProjectSearch(query))
    //  .subscribe(matches => {
    //    debug;
    //    this.suggestions = matches;

    //  });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onKeyDown(event) {
    let query = (event.query || "").toLocaleLowerCase();
    this.qs$.next(query);
  }

  focus() {
    this.autocomplete.domHandler.findSingle(this.autocomplete.el.nativeElement, 'input').focus();
  }

  onSelect(event) {
    this.componentHasValue.emit(event);
  }
  onKey(event) {

    this.textVal = this.selected
    this.componentHasValue.emit(this.textVal);
  }
  onClear(event) {
    this.componentHasValue.emit(this.selected.length > 1);
  }

}
