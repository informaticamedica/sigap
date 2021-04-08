import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'autocompletar',
  templateUrl: './autocompletar.component.html',
  styleUrls: ['./autocompletar.component.css']
})
export class AutocompletarComponent implements OnInit {

  @Input() placeholder: string;
  @Input() data: string[];

  @Output() output = new EventEmitter<string>();
  @Output() clear = new EventEmitter<boolean>();

  addNewItem(value: string) {
    
    this.output.emit(value);
  }



  ngOnInit() { }

  keyword = 'name';

  selectEvent(item) {
    // do something with selected item
    this.addNewItem(item)
  }
  searchCleared() {
    console.log('searchCleared');
    this.clear.emit(true);
    // this.data = [];
  }

  onChangeSearch(search: string) {
    
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e) {
    // console.log("e",e);
    // do something
  }

}
