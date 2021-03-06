import {AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output,} from "@angular/core";
import {ToolbarItem} from "../../models/toolbarItem";
import {version} from '../../../../package.json';
import {Observable} from "rxjs";

@Component({
    selector: 'toolbar',
    templateUrl: 'toolbar.component.html',
    styleUrls: ['toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
    @Input() menuItems: ToolbarItem[];
    @Input() status: Observable<string>;

    @Output() menuItemsChange = new EventEmitter<ToolbarItem[]>();
    @Output() save = new EventEmitter<void>();

    readonly version = version;

    displayMenuItems: ToolbarItem[];
    maxMenuItems = 0;

    constructor() { }

    ngOnInit() {
        this.displayMenuItems = this.menuItems.filter(item => !item.hidden);
    }

    @HostListener('window:resize', ['$event'])
    ngAfterViewInit() {
        setTimeout(() => this.maxMenuItems = Math.floor((document.getElementById('toolbar').offsetWidth - 100) / 75), 1);
    }

    clickWrapper(item: ToolbarItem, menu?: ToolbarItem[]) {
        if(item.toggle) {
            if (!item.individualToggle) {
                menu.filter(i => item.name != i.name && !i.individualToggle).forEach(item => {
                    item.enabled = false;
                    if (item.onDisabled) item.onDisabled(item);
                });
            }

            item.enabled = !item.enabled;
            this.menuItemsChange.emit(this.displayMenuItems);

            if(item.enabled) {
                if(item.onEnabled) item.onEnabled(item);
            } else {
                if(item.onDisabled) item.onDisabled(item);
            }
        }
        if(item.click) item.click(item);
    }
}
