import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  @Input("parentData") public name;
  @Output("onChildEvent") public childEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClickEvent(){
    this.childEvent.emit({
      id: 1,
      lastName: "Steven",
      firsName: "Orcun"
    })
  }

}
